angular.module('tbApp', [
  'tbTemplates', // only for AppController
  'ngRoute',
  'tbPeople'
])
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/people'
  });
}])
.controller('AppController', ['$scope', function($scope) {
  $scope.message = 'hello AppController';
}]);
