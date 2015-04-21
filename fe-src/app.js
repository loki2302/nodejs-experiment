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
}]).config(['$provide', function($provide) {
  $provide.decorator('$exceptionHandler', ['$delegate', '$injector', function($delegate, $injector) {
    return function(exception, cause) {
      $delegate(exception, cause);

      console.log('the custom exception handler says', exception, cause);

      var ApiErrors = $injector.get('ApiErrors');
      if(exception instanceof ApiErrors.ConnectivityError) {
        console.log('interpreted as ConnectivityError');
      } else if(exception instanceof ApiErrors.ValidationError) {
        console.log('interpreted as ValidationError');
      } else if(exception instanceof ApiErrors.NotFoundError) {
        console.log('interpreted as NotFoundError');
      } else if(exception instanceof ApiErrors.UnexpectedError) {
        console.log('interpreted as UnexpectedError');
      } else {
        console.log('interpreted as have no idea');
      }
    };
  }]);
}]).run(['$rootElement', function($rootElement) {
  // $rootElement is <html>
  // TODO: clean it up somehow
  $rootElement.find('span').remove();
  $rootElement.find('div').attr('style', '');
}]);
