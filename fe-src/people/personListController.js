angular.module('tbPersonList', [
  'ngRoute',
  'tbTemplates',
  'akoenig.deckgrid',
  'tbOperationExecutor'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people', {
    templateUrl: 'people/personList.html',
    controller: 'PersonListController',
    resolve: {
      people: ['apiService', 'execute', function(apiService, execute) {
        return execute(apiService.getPeople());
      }]
    }
  });
}])
.controller('PersonListController', [
  '$scope', 'people', 'execute', 'apiService', 'ApiErrors',
  function($scope, people, execute, apiService, ApiErrors) {
    $scope.people = people;

    $scope.deletePerson = function(person) {
      execute(apiService.deletePerson(person.id)).then(function() {
        var personIndex = $scope.people.indexOf(person);
        if(personIndex < 0) {
          throw new Error('Did not find the person in people');
        }

        $scope.people.splice(personIndex, 1);
      }, function(error) {
        if(error instanceof ApiErrors.NotFoundError) {
          console.log('PersonListController: the person does not exist');
        }

        throw error;
      });
    };
  }
]);
