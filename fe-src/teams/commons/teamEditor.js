angular.module('tbTeamEditor', [
  'tbSubmit',
  'tbListEditor',
  'tbTemplates',
  'ui.bootstrap'
])
.directive('tbTeamEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onSubmit: '&',
      onPersonLookup: '&',
      submitTitle: '@',
      teamTemplate: '=',
      busy: '='
    },
    templateUrl: 'teams/commons/teamEditor.html',
    link: function(scope) {
      if(!scope.submitTitle) {
        throw new Error('submitTitle is required');
      }

      if(!scope.teamTemplate) {
        throw new Error('teamTemplate is required');
      }

      this.getTeam = function() {
        return angular.copy(scope.teamTemplate);
      };

      scope.team = this.getTeam();

      scope.submitTeam = function() {
        return scope.onSubmit({
          team: scope.team
        });
      };

      scope.searchPeople = function(query) {
        return scope.onPersonLookup({
          query: query
        }).catch(function() {
          return [];
        });
      };
    }
  };
});
