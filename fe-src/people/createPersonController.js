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
    controller: 'CreatePersonController'
  });
}])
.controller('CreatePersonController', [
  '$scope', '$q', '$location', 'execute', 'apiService', 'ApiErrors',
  function($scope, $q, $location, execute, apiService, ApiErrors) {
    $scope.person = {memberships:[]};
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

    $scope.findTeamsByQuery = function(query) {
      return apiService.getTeams({
        nameContains: query,
        max: 5
      });
    };
  }]
);
