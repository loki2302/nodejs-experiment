angular.module('tbPersonEditor', [
  'tbValidationFacade',
  'tbListEditor',
  'tbTemplates',
  'ui.bootstrap'
])
.directive('tbPersonEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onSubmit: '&',
      onTeamLookup: '&',
      submitTitle: '@',
      personTemplate: '=',
      busy: '='
    },
    templateUrl: 'people/commons/personEditor.html',
    link: function(scope) {
      if(!scope.submitTitle) {
        throw new Error('submitTitle is required');
      }

      if(!scope.personTemplate) {
        throw new Error('personTemplate is required');
      }

      this.getPerson = function() {
        return angular.copy(scope.personTemplate);
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

      scope.searchTeams = function(query) {
        return scope.onTeamLookup({
          query: query
        }).catch(function() {
          return [];
        });
      };
    }
  };
});
