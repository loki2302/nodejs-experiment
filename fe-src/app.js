angular.module('tbApp', [
  'ngRoute',
  'tbApiService',
  'tbAppController',
  'tbHomeController',
  'tbOtherwiseController',
  'tbPeople',
  'tbTeams',
  'tbError',
]).config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode(true);
}]).config(['apiServiceProvider', function(apiServiceProvider) {
  apiServiceProvider.apiRoot('/api/');
}]).config(['$provide', function($provide) {
  $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function($delegate, $injector) {
    return function(exception, cause) {
      $delegate(exception, cause);

      var ApiErrors = $injector.get('ApiErrors');
      var showError = $injector.get('showError');
      var $location = $injector.get('$location');
      if(exception instanceof ApiErrors.ConnectivityError) {
        showError('It looks like you are offline');
      } else {
        showError('Something very unexpected has happened. ' +
          'The best thing we can do is navigating you to lolcats.').then(function() {
            $location.path('https://www.google.com/search?q=lolcats&tbm=isch');
          });
      }
    };
  }]);
}]).run(['$rootElement', function($rootElement) {
  // $rootElement is <html>
  // TODO: clean it up somehow
  $rootElement.find('span').remove();
  $rootElement.find('div').attr('style', '');
}]);
