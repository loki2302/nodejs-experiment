angular.module('tbViewPerson', [
  'ngRoute',
  'tbTemplates',
  'tbApiService',
  'tbOperationExecutor',
  'tbError'
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
  '$scope', '$location', 'execute', 'apiService', 'person', 'ApiErrors', 'showError',
  function($scope, $location, execute, apiService, person, ApiErrors, showError) {
    $scope.person = person;

    $scope.deletePerson = function() {
      execute(apiService.deletePerson($scope.person.id)).then(function() {
        $location.path('/people');
      }, function(error) {
        if(error instanceof ApiErrors.NotFoundError) {
          var message = 'It took you too long: this person does not exist anymore. ' +
            'Once you click OK, we will navigate you to the list of people.';
          showError(message).then(function() {
            $location.path('/people');
          });
        } else {
          throw error;
        }
      });
    };
  }]
);
