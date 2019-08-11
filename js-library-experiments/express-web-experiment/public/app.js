angular.module("app", [], ["$interpolateProvider", function($interpolateProvider) {
  $interpolateProvider.startSymbol("[[");
  $interpolateProvider.endSymbol("]]");
}]);

angular.module("app").factory("api", ["$http", function($http) {
  return {
    addNumbers: function(a, b, onResult) {
      $http.get("/api/addNumbers/", {"params": {"a": a, "b": b}}).success(function(response) {
        onResult(response.result);
      });
    }
  };
}]);

angular.module("app").controller("CalculatorController", ["$scope", "api", function ($scope, api) {
  $scope.a = 0;
  $scope.b = 0;
  $scope.result = 0;
  $scope.calculate = function() {
    api.addNumbers($scope.a, $scope.b, function(result) {
      $scope.result = result;
    });
  };
}]);
