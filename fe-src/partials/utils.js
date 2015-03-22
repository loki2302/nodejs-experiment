angular.module('app.directives.utils', [])
.directive('validationFacade', function() {
  // use like this: <form validation-facade="be">
  // this will publish 'be' with setAllFieldsValid and setFieldErrors
  // to the related scope
  return {
    require: 'form',
    link: function(scope, element, attrs, ctrl) {
      var errors = {};
      scope[attrs.validationFacade] = {
        setAllFieldsValid: function() {
          angular.forEach(ctrl, function(formElement, fieldName) {
            if(fieldName[0] === '$') {
              return;
            }

            ctrl[fieldName].$setValidity('omg', true);              
          });
          errors = {};
        },
        setFieldErrors: function(errorMap) {
          angular.forEach(errorMap, function(message, fieldName) {
            var field = ctrl[fieldName];
            if(!field) {
              throw new Error('No field with name ' + fieldName);
            }

            ctrl[fieldName].$setValidity('omg', false);
            ctrl[fieldName].$setPristine();
          });
          errors = errorMap;
        },
        getFieldError: function(fieldName) {
          return errors[fieldName];
        },
        isError: function(fieldName) {
          return ctrl[fieldName].$invalid && ctrl[fieldName].$pristine;
        }
      };
    }
  };
});
