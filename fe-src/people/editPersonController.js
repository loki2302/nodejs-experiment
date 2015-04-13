angular.module('tbEditPerson', [
  'ngRoute',
  'tbTemplates',
  'tbPersonEditor',
  'tbOperationExecutor',
  'tbApiService'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people/:id/edit', {
    templateUrl: 'people/editPerson.html',
    controller: 'EditPersonController',
    resolve: {
      person: ['$route', 'execute', 'apiService', function($route, execute, apiService) {
        var id = $route.current.params.id;
        return execute(apiService.getPerson(id));
      }]
    }
  });
}])
.controller('EditPersonController', [
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors', 'person',
  function($scope, $q, $location, execute, apiService, ApiErrors, person) {
    $scope.person = person;

    $scope.updatePerson = function(person) {
      return execute(apiService.updatePerson(person).then(function(person) {
        // TODO: what would be the better option? Can I use a $route template?
        $location.path('/people/' + person.id);
      }, function(error) {
        if(error instanceof ApiErrors.ValidationError) {
          return $q.reject(error.errorMap);
        }

        throw error;
      }));
    };

    $scope.findTeamsByQuery = function(query) {
      return apiService.getTeams({
        nameContains: query,
        max: 5
      });
    };
  }]
);
