angular.module('tbErrorModal', [])
.controller('ErrorModalController', [
  '$scope', '$modalInstance', 'message',
  function($scope, $modalInstance, message) {
    $scope.message = message;

    $scope.handleOk = function() {
      $modalInstance.close();
    };
  }
]);
