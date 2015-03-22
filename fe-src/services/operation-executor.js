angular.module('operationExecutor', [])
.service('operationExecutor', ['$rootScope', function($rootScope) {
  this.execute = function(promise) {
    $rootScope.busy = true;
    return promise.finally(function() {
      $rootScope.busy = false;
    });
  };
}]);
