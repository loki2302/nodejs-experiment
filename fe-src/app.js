angular.module('tbApp', [
  'ngRoute',
  'tbApiService',
  'tbAppController',
  'tbHomeController',
  'tbOtherwiseController',
  'tbPeople',
  'tbTeams'
]).config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]).config(['apiServiceProvider', function(apiServiceProvider) {
  apiServiceProvider.apiRoot('/api/');
}]).run(['$rootElement', function($rootElement) {
  // $rootElement is <html>
  // TODO: clean it up somehow
  $rootElement.find('span').remove();
  $rootElement.find('div').attr('style', '');
}]);
