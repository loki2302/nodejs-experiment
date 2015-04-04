angular.module('tbViewPerson', [
  'ngRoute',
  'tbTemplates',
  'tbApiService'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people/:id', {
    templateUrl: 'people/view/viewPerson.html',
    controller: 'ViewPersonController',
    resolve: {
      person: ['$route', 'apiService', 'ApiErrors', function($route, apiService, ApiErrors) {
        var id = $route.current.params.id;
        return apiService.getPerson(id).then(function(person) {
          return person;
        }, function(error) {
          return null;
        });
      }]
    }
  });
}])
.controller('ViewPersonController', [
  '$scope', 'person',
  function($scope, person) {
    $scope.person = person;
  }]
);
