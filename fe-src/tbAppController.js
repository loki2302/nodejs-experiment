angular.module('tbAppController', [
  'tbTemplates'
]).controller('AppController', ['$scope', '$location', function($scope, $location) {
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
}]);
