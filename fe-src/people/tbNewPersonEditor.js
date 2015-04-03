angular.module('tbNewPersonEditor', [
  'tbValidationFacade',
  'tbTemplates'
])
.directive('tbNewPersonEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&',
      busy: '='
    },
    templateUrl: 'people/newPersonEditor.html',
    link: function(scope) {
      scope.person = makeEmptyPerson();

      scope.createPerson = function(e) {
        e.preventDefault();

        scope.vf.setAllFieldsValid();
        scope.onCreate({
          person: scope.person
        }).then(function() {
          scope.person = makeEmptyPerson();
        }, function(errors) {
          scope.vf.setFieldErrors(errors);
        });
      };

      function makeEmptyPerson() {
        return {
          name: ''
        };
      };
    }
  };
});
