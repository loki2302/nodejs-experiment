angular.module('tbPersonList', [
  'ngRoute',
  'tbTemplates',
  'akoenig.deckgrid',
  'tbOperationExecutor',
  'tbError'
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
  '$scope', 'people', 'execute', 'apiService', 'ApiErrors', 'showError', '$route',
  function($scope, people, execute, apiService, ApiErrors, showError, $route) {
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
          var message = 'It took you too long: this person does not exist anymore. ' +
            'Once you click OK, we will refresh this page.';
          showError(message).then(function() {
            $route.reload();
          });
        } else {
          throw error;
        }
      });
    };
  }
]);
