angular.module('tbEditTeam', [
  'ngRoute',
  'tbTemplates',
  'tbListEditor',
  'tbSubmit',
  'ui.bootstrap',
  'tbOperationExecutor',
  'tbApiService',
  'tbError'
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
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors', 'team', 'showError',
  function($scope, $q, $location, execute, apiService, ApiErrors, team, showError) {
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
          var message = 'It took you too long: this team does not exist anymore. ' +
            'Once you click OK, we will navigate you to the list of teams.';
          showError(message).then(function() {
            $location.path('/teams');
          });
        } else {
          throw error;
        }
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
