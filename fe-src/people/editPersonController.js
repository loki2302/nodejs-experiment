angular.module('tbEditPerson', [
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
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors', 'person', 'showError',
  function($scope, $q, $location, execute, apiService, ApiErrors, person, showError) {
    $scope.person = person;
    $scope.pageTitle = person.name;
    $scope.submitTitle = 'Update';

    $scope.submitPerson = function(person) {
      return execute(apiService.updatePerson(person).then(function(person) {
        $location.path('/people/' + person.id);
      }, function(error) {
        if(error instanceof ApiErrors.ValidationError) {
          return $q.reject(error.errorMap);
        } else if(error instanceof ApiErrors.NotFoundError) {
          var message = 'It took you too long: this person does not exist anymore. ' +
            'Once you click OK, we will navigate you to the list of people.';
          showError(message).then(function() {
            $location.path('/people');
          });
        } else {
          throw error;
        }
      }));
    };

    $scope.randomizeAvatar = function() {
      return execute(apiService.getRandomAvatar().then(function(randomAvatar) {
        $scope.person.avatar = randomAvatar.url;
      }, function(error) {
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
