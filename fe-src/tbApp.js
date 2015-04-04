angular.module('tbApp', [
  'ngRoute',
  'tbApiService',
  'tbAppController',
  'tbPeople',
  'tbTeams'
])
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}])
.config(['apiServiceProvider', function(apiServiceProvider) {
  apiServiceProvider.apiRoot('/api/');
}])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    redirectTo: '/people'
  });
}]);
