angular.module('tbAppController', [
  'tbTemplates'
]).controller('AppController',
  ['$rootScope', '$scope', '$location',
  function($rootScope, $scope, $location) {
    $scope.isNavBarActive = function(navBarName) {
      var path = $location.path();

      if(path === '/people' && navBarName === 'people') {
        return true;
      }

      if(path === '/teams' && navBarName === 'teams') {
        return true;
      }

      return false;
    };

    // TODO: extract this to a separate directive to reuse for "otherwise" and route change errors
    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      console.log('$routeChangeSuccess', event, current, previous);
      $rootScope.error = null;
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      console.log('$routeChangeError', event, current, previous, rejection);
      $rootScope.error = "404 omg";
    });
  }]
);
