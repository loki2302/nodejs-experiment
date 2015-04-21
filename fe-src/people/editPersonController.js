angular.module('tbEditPerson', [
  'ngRoute',
  'tbTemplates',
  'tbListEditor',
  'tbSubmit',
  'ui.bootstrap',
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
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors', 'person', '$modal',
  function($scope, $q, $location, execute, apiService, ApiErrors, person, $modal) {
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
          console.log('EditPersonController: the person does not exist');
          // TODO: show modal, redirect to /people
          var modalInstance = $modal.open({
            backdrop: 'static',
            templateUrl: 'errorModal.html',
            controller: 'ErrorModalController',
            resolve: {
              message: function() {
                return 'It took you too long: this person does not exist anymore. ' +
                  'Once you click OK, we will navigate you to the list of people.'
              }
            }
          });
          modalInstance.result.finally(function() {
            console.log('modal has been closed');
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
