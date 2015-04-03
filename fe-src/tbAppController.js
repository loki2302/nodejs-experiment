angular.module('tbAppController', [
  'tbTemplates'
]).controller('AppController', ['$scope', function($scope) {
  $scope.message = 'hello AppController';
}]);
