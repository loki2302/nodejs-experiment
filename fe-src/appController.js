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

    $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
      if(current.controller === 'OtherwiseController') {
        return;
      }

      $rootScope.error = false;
    });

    $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
      $rootScope.error = true;
    });
  }]
);
