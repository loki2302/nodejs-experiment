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
  '$scope', 'people', 'execute', 'apiService',
  function($scope, people, execute, apiService) {
    $scope.people = people;

    $scope.deletePerson = function(person) {
      execute(apiService.deletePerson(person.id)).then(function() {
        var personIndex = $scope.people.indexOf(person);
        if(personIndex < 0) {
          throw new Error('Did not find the person in people');
        }

        $scope.people.splice(personIndex, 1);
      }, function(error) {
        throw error;
      });
    };
  }
]);
