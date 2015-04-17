angular.module('tbTeamList', [
  'ngRoute',
  'tbTemplates',
  'akoenig.deckgrid',
  'tbOperationExecutor'
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
  '$scope', 'teams', 'execute', 'apiService',
  function($scope, teams, execute, apiService) {
    $scope.teams = teams;

    $scope.deleteTeam = function(team) {
      console.log(111);
      execute(apiService.deleteTeam(team.id)).then(function() {
        var teamIndex = $scope.teams.indexOf(team);
        if(teamIndex < 0) {
          throw new Error('Did not find the team in teams');
        }

        $scope.teams.splice(teamIndex, 1);
      }, function(error) {
        throw error;
      });
    };
  }
]);
