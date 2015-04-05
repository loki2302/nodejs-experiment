angular.module('tbPersonEditor', [
  'tbValidationFacade',
  'tbTemplates'
])
.directive('tbPersonEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onUpdate: '&',
      original: '=',
      busy: '='
    },
    templateUrl: 'people/edit/personEditor.html',
    link: function(scope) {
      this.originalPerson = angular.copy(scope.original);
      this.getPerson = function() {
        return angular.copy(this.originalPerson);
      };

      scope.person = this.getPerson();

      scope.updatePerson = function(e) {
        e.preventDefault();

        scope.vf.setAllFieldsValid();
        scope.onUpdate({
          person: scope.person
        }).then(function() {
          scope.person = this.getPerson();
        }, function(errors) {
          scope.vf.setFieldErrors(errors);
        });
      };
    }
  };
});
