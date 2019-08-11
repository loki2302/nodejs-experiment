angular.module('tbError', ['ui.bootstrap'])
.factory('showError', ['$modal', '$q', function($modal, $q) {
  return function(message) {
    var modalInstance = $modal.open({
      backdrop: 'static',
      templateUrl: 'errorModal.html',
      controller: 'ErrorModalController',
      windowClass: 'error-modal',
      resolve: {
        message: function() {
          return message;
        }
      }
    });

    var deferred = $q.defer();

    modalInstance.result.finally(function() {
      deferred.resolve();
    });

    return deferred.promise;
  };
}])
.controller('ErrorModalController', [
  '$scope', '$modalInstance', 'message',
  function($scope, $modalInstance, message) {
    $scope.message = message;

    $scope.handleOk = function() {
      $modalInstance.close();
    };
  }
]);
