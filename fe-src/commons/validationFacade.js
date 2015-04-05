angular.module('tbValidationFacade', [])
.directive('tbValidationFacade', function() {
  // use like this: <form tb-validation-facade="be">
  // this will publish 'be' with setAllFieldsValid and setFieldErrors
  // to the related scope
  return {
    require: '^form',
    link: function(scope, element, attrs, ctrl) {
      var errors = {};
      scope[attrs.tbValidationFacade] = {
        setAllFieldsValid: function() {
          angular.forEach(ctrl, function(formElement, fieldName) {
            if(fieldName[0] === '$') {
              return;
            }

            ctrl[fieldName].$setValidity('tbValidationFacadeValidator', true);
          });
          errors = {};
        },
        setFieldErrors: function(errorMap) {
          angular.forEach(errorMap, function(message, fieldName) {
            var field = ctrl[fieldName];
            if(!field) {
              throw new Error('No field with name ' + fieldName);
            }

            ctrl[fieldName].$setValidity('tbValidationFacadeValidator', false);
            ctrl[fieldName].$setPristine();
          });
          errors = errorMap;
        },
        getFieldError: function(fieldName) {
          return errors[fieldName];
        },
        isError: function(fieldName) {
          var field = ctrl[fieldName];
          if(!field) {
            // because form's child elements get linked _before_ the
            // form itself is ready, isError() may get called _before_
            // the control has had registered. In this case we just
            // say the field is valid
            // TODO: is there a better approach?
            return false;
          }

          return field.$invalid && field.$pristine;
        }
      };
    }
  };
});
