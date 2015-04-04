angular.module('tbApp', [
  'ngRoute',
  'tbApiService',
  'tbAppController',
  'tbOtherwiseController',
  'tbPeople',
  'tbTeams'
]).config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]).config(['apiServiceProvider', function(apiServiceProvider) {
  apiServiceProvider.apiRoot('/api/');
}]);
