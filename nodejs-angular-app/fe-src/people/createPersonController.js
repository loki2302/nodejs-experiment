angular.module('tbCreatePerson', [
  'ngRoute',
  'tbTemplates',
  'tbListEditor',
  'tbSubmit',
  'ui.bootstrap',
  'tbOperationExecutor',
  'tbApiService'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people/create', {
    templateUrl: 'people/editPerson.html',
    controller: 'CreatePersonController',
    resolve: {
      avatar: ['execute', 'apiService', function(execute, apiService) {
        return execute(apiService.getRandomAvatar().then(function(randomAvatar) {
          return randomAvatar.url;
        }));
      }]
    }
  });
}])
.controller('CreatePersonController', [
  '$scope', '$q', '$location', 'avatar', 'execute', 'apiService', 'ApiErrors',
  function($scope, $q, $location, avatar, execute, apiService, ApiErrors) {
    $scope.person = {
      avatar: avatar,
      memberships: []
    };
    $scope.pageTitle = 'Create Person';
    $scope.submitTitle = 'Create';

    $scope.submitPerson = function(person) {
      return execute(apiService.createPerson(person).then(function(person) {
        $location.path('/people/' + person.id);
      }, function(error) {
        if(error instanceof ApiErrors.ValidationError) {
          return $q.reject(error.errorMap);
        }

        throw error;
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
