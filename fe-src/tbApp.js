angular.module('tbApp', [
  'ngRoute',
  'tbAppController',
  'tbPeople'
])
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/people'
  });
}]);
