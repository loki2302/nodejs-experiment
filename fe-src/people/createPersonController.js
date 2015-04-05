angular.module('tbCreatePerson', [
  'ngRoute',
  'tbTemplates',
  'tbPersonEditor',
  'tbOperationExecutor',
  'tbApiService'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people/create', {
    templateUrl: 'people/createPerson.html',
    controller: 'CreatePersonController'
  });
}])
.controller('CreatePersonController', [
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors',
  function($scope, $q, $location, execute, apiService, ApiErrors) {
    $scope.createPerson = function(person) {
      return execute(apiService.createPerson(person).then(function(person) {
        // TODO: what would be the better option? Can I use a $route template?
        $location.path('/people/' + person.id);
      }, function(error) {
        if(error instanceof ApiErrors.ValidationError) {
          return $q.reject(error.errorMap);
        }

        throw error;
      }));
    };
  }]
);
