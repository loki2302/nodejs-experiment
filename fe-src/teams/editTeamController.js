angular.module('tbEditTeam', [
  'ngRoute',
  'tbTemplates',
  'tbListEditor',
  'tbSubmit',
  'ui.bootstrap',
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
    $scope.pageTitle = team.name;
    $scope.submitTitle = 'Update';

    $scope.submitTeam = function(team) {
      return execute(apiService.updateTeam(team).then(function(team) {
        $location.path('/teams/' + team.id);
      }, function(error) {
        if(error instanceof ApiErrors.ValidationError) {
          return $q.reject(error.errorMap);
        } else if(error instanceof ApiErrors.NotFoundError) {
          console.log('EditTeamController: the team does not exist');
          // TODO: show modal, redirect to /teams
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
