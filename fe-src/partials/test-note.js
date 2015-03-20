angular.module("directives.testNote", [])
.directive('validationFacade', function() {
  // use like this: <form be="be">
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
})
.directive('testNoteEdit', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      submit: '&',
      note: '=ngModel'
    },
    template: 
    '<form ng-submit="handleSubmit()" validation-facade="vf">' +
    ' <div class="text-form-group" ng-class="{' + "'has-error':vf.isError('text')" + '}">' +
    '  <input type="text" class="note-text" name="text" ng-model="note.text">' +
    ' </div>' +
    ' <button type="submit" class="submit">Submit</button>' +
    '</form>',
    link: function(scope) {
      scope.handleSubmit = function() {
        scope.vf.setAllFieldsValid();
        scope.submit({note: scope.note}).then(function(resolution) {
          console.log('success', resolution);
        }, function(error) {
          console.log('error', error);
          scope.vf.setFieldErrors(error);
        });
      };
    }
  };
})
.directive('testNoteView', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      note: "=ngModel",
      edit: "&"
    },
    template: 
    '<div>' + 
    '  <span class="note-text">{{note.text}}</span>' + 
    '  <button class="note-edit" type="button" ng-click="edit({note: note})">Edit</button>' + 
    '</div>',
    controller: function($scope, $element, $attrs, $transclude, /*any injectables*/ $log) {
      // console.log('controller'); // 1: before link
    },
    link: function(scope, element, attrs /*, parentController */) {
      // console.log('link'); // 2: after controller
    }        
  };
});
