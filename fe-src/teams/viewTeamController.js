angular.module('tbViewTeam', [
  'ngRoute',
  'tbTemplates',
  'tbApiService',
  'tbOperationExecutor'
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
  '$scope', '$location', 'execute', 'apiService', 'team',
  function($scope, $location, execute, apiService, team) {
    $scope.team = team;

    $scope.deleteTeam = function() {
      execute(apiService.deleteTeam($scope.team.id)).then(function() {
        $location.path('/teams');
      }, function(error) {
        throw error;
      });
    };
  }]
);
