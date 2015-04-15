angular.module('tbCreateTeam', [
  'ngRoute',
  'tbTemplates',
  'tbTeamEditor',
  'tbOperationExecutor',
  'tbApiService'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/teams/create', {
    templateUrl: 'teams/createTeam.html',
    controller: 'CreateTeamController'
  });
}])
.controller('CreateTeamController', [
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors',
  function($scope, $q, $location, execute, apiService, ApiErrors) {
    $scope.createTeam = function(team) {
      return execute(apiService.createTeam(team).then(function(team) {
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
