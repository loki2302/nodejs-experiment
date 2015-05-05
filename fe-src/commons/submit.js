angular.module('tbSubmit', [])
.directive('tbSubmit', function() {
  var VALIDATION_ERROR_KEY = 'customValidator';

  return {
    restrict: 'A',
    require: 'form',
    link: function(scope, element, attrs, formController) {
      var exposeErrorsAs = attrs.exposeErrorsAs;
      if(!exposeErrorsAs) {
        throw new Error('"exposeErrorsAs" is required');
      }

      var $element = angular.element(element);
      $element.bind('submit', function(e) {
        e.preventDefault();

        scope.$apply(function() {
          setAllFieldsValid();
        });
        scope.$eval(attrs.tbSubmit).then(null, function(errors) {
          setFieldErrors(errors);
        });
      });

      // prevent form submission on enter
      $element.bind('keydown keypress', function(e) {
        if(e.which === 13) {
          e.preventDefault();
        }
      });
      // TODO: should I unbind?

      var errors = {};
      function setAllFieldsValid() {
        angular.forEach(formController, function(formElement, fieldName) {
          if(fieldName[0] === '$') {
            return;
          }

          formController[fieldName].$setValidity(VALIDATION_ERROR_KEY, true);
        });
        errors = {};
      };

      function setFieldErrors(errorMap) {
        angular.forEach(errorMap, function(message, fieldName) {
          var isRealFormField = fieldName in formController;
          if(!isRealFormField) {
            return;
          }

          formController[fieldName].$setValidity(VALIDATION_ERROR_KEY, false);
          formController[fieldName].$setPristine();
        });
        errors = errorMap;
      };

      scope[exposeErrorsAs] = {
        isError: function(fieldName) {
          var field = formController[fieldName];
          if(!field) {
            if(!errors[fieldName]) {
              // because form's child elements get linked _before_ the
              // form itself is ready, isError() may get called _before_
              // the control has had registered. In this case we just
              // say the field is valid
              // TODO: is there a better approach?
              return false;
            }

            return true;
          }

          return field.$invalid && field.$pristine;
        },
        getFieldError: function(fieldName) {
          return errors[fieldName];
        }
      };
    }
  };
});
