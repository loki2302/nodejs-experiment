angular.module('tbTeamEditor', [
  'tbValidationFacade',
  'tbTemplates'
])
.directive('tbTeamEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onSubmit: '&',
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

      this.teamTemplate = angular.copy(scope.teamTemplate);
      this.getTeam = function() {
        return angular.copy(this.teamTemplate);
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
    }
  };
});
