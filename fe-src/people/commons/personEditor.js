angular.module('tbPersonEditor', [
  'tbSubmit',
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

      scope.submitPerson = function() {
        return scope.onSubmit({
          person: scope.person
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
