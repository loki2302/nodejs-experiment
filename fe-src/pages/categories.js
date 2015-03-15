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
.controller("CategoriesController", ["$scope", "$q", "categories", "apiService", 'errors', function($scope, $q, categories, apiService, errors) {
	$scope.categories = categories;

	$scope.createCategory = function(category) {
		return apiService.createCategory(category).then(function(category) {
			apiService.getCategories().then(function(categories) {
				$scope.categories = categories;
			}, function(error) {
				throw error;
			});
		}, function(error) {
			if(error instanceof errors.ValidationError) {
				return $q.reject(error.errorMap);
			}
			
			throw error;
		});
	};

	$scope.updateCategory = function(category) {
		return apiService.updateCategory(category).then(function(category) {
			apiService.getCategories().then(function(categories) {
				$scope.categories = categories;
			}, function(error) {
				throw error;
			});
		}, function(error) {
			if(error instanceof errors.ValidationError) {
				return $q.reject(error.errorMap);
			}

			throw error;
		});
	};

	$scope.deleteCategory = function(category) {
		return apiService.deleteCategory(category).then(function() {
			apiService.getCategories().then(function(categories) {
				$scope.categories = categories;
			}, function(error) {
				throw error;
			});
		}, function(error) {
			throw error;
		});
	};
}]);
