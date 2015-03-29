angular.module('tb.app', [
  'ngRoute'
])
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });
}])
.controller('AppController', ['$scope', function($scope) {
  $scope.message = 'hello AppController';
}]);
