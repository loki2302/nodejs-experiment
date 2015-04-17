angular.module('tbCreateTeam', [
  'ngRoute',
  'tbTemplates',
  'tbOperationExecutor',
  'tbApiService'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/teams/create', {
    templateUrl: 'teams/editTeam.html',
    controller: 'CreateTeamController'
  });
}])
.controller('CreateTeamController', [
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors',
  function($scope, $q, $location, execute, apiService, ApiErrors) {
    $scope.team = {members:[]};
    $scope.pageTitle = 'Create Team';
    $scope.submitTitle = 'Create';

    $scope.submitTeam = function(team) {
      return execute(apiService.createTeam(team).then(function(team) {
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
