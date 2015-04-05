angular.module('tbPersonEditor', [
  'tbValidationFacade',
  'tbTemplates'
])
.directive('tbPersonEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onSubmit: '&',
      submitTitle: '@',
      personTemplate: '=',
      busy: '='
    },
    templateUrl: 'people/commons/personEditor.html',
    link: function(scope) {
      this.personTemplate = angular.copy(scope.personTemplate);
      this.getPerson = function() {
        return angular.copy(this.personTemplate);
      };

      scope.person = this.getPerson();

      scope.submitPerson = function(e) {
        e.preventDefault();

        scope.vf.setAllFieldsValid();
        scope.onSubmit({
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
