angular.module('tbPersonList', [
  'ngRoute',
  'tbTemplates',
  'tbOperationExecutor'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people', {
    templateUrl: 'people/list/personList.html',
    controller: 'PersonListController',
    resolve: {
      people: ['apiService', 'execute', function(apiService, execute) {
        return execute(apiService.getPeople());
      }]
    }
  });
}])
.controller('PersonListController', ['$scope', 'people', function($scope, people) {
  $scope.people = people;
}]);
