angular.module('tbViewPerson', [
  'ngRoute',
  'tbTemplates',
  'tbApiService',
  'tbOperationExecutor'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people/:id', {
    templateUrl: 'people/viewPerson.html',
    controller: 'ViewPersonController',
    resolve: {
      person: ['$route', 'execute', 'apiService', function($route, execute, apiService) {
        var id = $route.current.params.id;
        return execute(apiService.getPerson(id));
      }]
    }
  });
}])
.controller('ViewPersonController', [
  '$scope', '$location', 'execute', 'apiService', 'person',
  function($scope, $location, execute, apiService, person) {
    $scope.person = person;

    $scope.deletePerson = function() {
      execute(apiService.deletePerson($scope.person.id)).then(function() {
        $location.path('/people');
      }, function(error) {
        throw error;
      });
    };
  }]
);
