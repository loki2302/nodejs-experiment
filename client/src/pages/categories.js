angular.module("categories", [
	"ngRoute", 
	"directives.categories.categoryItemView", 
	"directives.categories.categoryEditor",
	"api"
])
.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/categories", {
		templateUrl: "categories.html",
		controller: "CategoriesController",
		resolve: {
			categories: ["apiService", function(apiService) {
				return apiService.getCategories();
			}]
		}
	});
}])
.controller("CategoriesController", ["$scope", "$q", "categories", "apiService", function($scope, $q, categories, apiService) {
	$scope.categories = categories;

	$scope.createCategory = function(category) {
		return apiService.createCategory(category).then(function(category) {
			$scope.categories = apiService.getCategories();
		}, function(error) {
			if(error instanceof apiService.ValidationError) {
				return $q.reject(error.errorMap);
			}
			
			throw error;
		});
	};

	$scope.updateCategory = function(category) {
		return apiService.updateCategory(category).then(function(category) {
			$scope.categories = apiService.getCategories();
		}, function(error) {
			if(error instanceof apiService.ValidationError) {
				return $q.reject(error.errorMap);
			}

			throw error;
		});
	};

	$scope.deleteCategory = function(category) {
		return apiService.deleteCategory(category).then(function() {
			$scope.categories = apiService.getCategories();
		}, function(error) {
			throw error;
		});
	};
}]);
