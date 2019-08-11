angular.module('tbViewTeam', [
  'ngRoute',
  'tbTemplates',
  'tbApiService',
  'tbOperationExecutor',
  'tbError'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/teams/:id', {
    templateUrl: 'teams/viewTeam.html',
    controller: 'ViewTeamController',
    resolve: {
      team: ['$route', 'execute', 'apiService', function($route, execute, apiService) {
        var id = $route.current.params.id;
        return execute(apiService.getTeam(id));
      }]
    }
  });
}])
.controller('ViewTeamController', [
  '$scope', '$location', 'execute', 'apiService', 'team', 'ApiErrors', 'showError',
  function($scope, $location, execute, apiService, team, ApiErrors, showError) {
    $scope.team = team;

    $scope.deleteTeam = function() {
      execute(apiService.deleteTeam($scope.team.id)).then(function() {
        $location.path('/teams');
      }, function(error) {
        if(error instanceof ApiErrors.NotFoundError) {
          var message = 'It took you too long: this team does not exist anymore. ' +
            'Once you click OK, we will navigate you to the list of teams.';
          showError(message).then(function() {
            $location.path('/teams');
          });
        } else {
          throw error;
        }
      });
    };
  }]
);
