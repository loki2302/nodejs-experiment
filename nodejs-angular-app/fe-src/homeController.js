angular.module('tbHomeController', [
  'tbApiService',
  'tbOperationExecutor'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'home.html',
    controller: 'HomeController',
    resolve: {
      stats: ['apiService', 'execute', function(apiService, execute) {
        return execute(apiService.getStats());
      }]
    }
  });
}])
.controller('HomeController', ['$scope', 'stats', function($scope, stats) {
  $scope.stats = stats;
}]);
