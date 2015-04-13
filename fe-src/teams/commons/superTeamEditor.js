angular.module('tbSuperTeamEditor', [
  'tbValidationFacade',
  'tbListEditor',
  'tbTemplates',
  'ui.bootstrap'
])
.directive('tbSuperTeamEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onSubmit: '&',
      onPersonLookup: '&',
      submitTitle: '@',
      teamTemplate: '=',
      busy: '='
    },
    templateUrl: 'teams/commons/superTeamEditor.html',
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

      scope.submitTeam = function(e) {
        e.preventDefault();

        scope.vf.setAllFieldsValid();
        scope.onSubmit({
          team: scope.team
        }).then(function() {
          scope.team = this.getTeam();
        }, function(errors) {
          scope.vf.setFieldErrors(errors);
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
