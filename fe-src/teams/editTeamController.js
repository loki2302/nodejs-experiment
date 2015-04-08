angular.module('tbEditTeam', [
  'ngRoute',
  'tbTemplates',
  'tbTeamEditor',
  'tbOperationExecutor',
  'tbApiService'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/teams/:id/edit', {
    templateUrl: 'teams/editTeam.html',
    controller: 'EditTeamController',
    resolve: {
      team: ['$route', 'execute', 'apiService', function($route, execute, apiService) {
        var id = $route.current.params.id;
        return execute(apiService.getTeam(id));
      }]
    }
  });
}])
.controller('EditTeamController', [
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors', 'team',
  function($scope, $q, $location, execute, apiService, ApiErrors, team) {
    $scope.team = team;

    $scope.updateTeam = function(team) {
      return execute(apiService.updateTeam(team).then(function(team) {
        // TODO: what would be the better option? Can I use a $route template?
        $location.path('/teams/' + team.id);
      }, function(error) {
        if(error instanceof ApiErrors.ValidationError) {
          return $q.reject(error.errorMap);
        }

        throw error;
      }));
    };

    $scope.findPeopleByQuery = function(query) {
      return apiService.getPeople({
        nameContains: query,
        max: 5
      });
    };
  }]
);
