angular.module('tbOperationExecutor', [
]).factory('execute', ['$rootScope', function($rootScope) {
  return function(promise) {
    $rootScope.busy = true;
    return promise.finally(function() {
      $rootScope.busy = false;
    });
  };
}]);
