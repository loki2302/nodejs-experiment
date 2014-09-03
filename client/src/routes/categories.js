angular.module("categories", ["ngRoute"])
.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/categories", {
		templateUrl: "categories.html",
		controller: "CategoriesController"
	});
}])
.controller("CategoriesController", ["$scope", function($scope) {
	$scope.message = "Coming soon!";
}]);
