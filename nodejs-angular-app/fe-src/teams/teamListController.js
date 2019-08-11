angular.module('tbTeamList', [
  'ngRoute',
  'tbTemplates',
  'akoenig.deckgrid',
  'tbOperationExecutor',
  'tbError'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/teams', {
    templateUrl: 'teams/teamList.html',
    controller: 'TeamListController',
    resolve: {
      teams: ['apiService', 'execute', function(apiService, execute) {
        return execute(apiService.getTeams());
      }]
    }
  });
}])
.controller('TeamListController', [
  '$scope', 'teams', 'execute', 'apiService', 'ApiErrors', 'showError', '$route',
  function($scope, teams, execute, apiService, ApiErrors, showError, $route) {
    $scope.teams = teams;

    $scope.deleteTeam = function(team) {
      execute(apiService.deleteTeam(team.id)).then(function() {
        var teamIndex = $scope.teams.indexOf(team);
        if(teamIndex < 0) {
          throw new Error('Did not find the team in teams');
        }

        $scope.teams.splice(teamIndex, 1);
      }, function(error) {
        if(error instanceof ApiErrors.NotFoundError) {
          var message = 'It took you too long: this team does not exist anymore. ' +
            'Once you click OK, we will refresh this page.';
          showError(message).then(function() {
            $route.reload();
          });
        } else {
          throw error;
        }
      });
    };
  }
]);
