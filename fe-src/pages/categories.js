angular.module('categories', [
	'ngRoute', 
	'directives.categories.createCategory',
	'directives.categories.categoryItem',
	'api',
	'operationExecutor'
])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/categories', {
		templateUrl: 'categories.html',
		controller: 'CategoriesController',
		resolve: {
			categories: ['apiService', function(apiService) {
				return apiService.getCategories();
			}]
		}
	});
}])
.controller('CategoriesController', 
	['$scope', '$q', 'categories', 'apiService', 'errors', 'execute', 
	function($scope, $q, categories, apiService, errors, execute) {

	$scope.categories = categories;

	$scope.createCategory = function(category) {
		return execute(apiService.createCategory(category).then(function(category) {
			return apiService.getCategories().then(function(categories) {
				$scope.categories = categories;
			}, function(error) {
				throw error;
			});
		}, function(error) {
			if(error instanceof errors.ValidationError) {
				return $q.reject(error.errorMap);
			}

			if(error instanceof errors.ConflictError) {
				return $q.reject({ name: 'Already exists' });
			}
			
			throw error;
		}));
	};

	$scope.updateCategory = function(category) {
		return execute(apiService.updateCategory(category).then(function(category) {
			return apiService.getCategories().then(function(categories) {
				$scope.categories = categories;
			}, function(error) {
				throw error;
			});
		}, function(error) {
			if(error instanceof errors.ValidationError) {
				return $q.reject(error.errorMap);
			}

			if(error instanceof errors.ConflictError) {
				return $q.reject({ name: 'Already exists' });
			}

			throw error;
		}));
	};

	$scope.deleteCategory = function(category) {
		return execute(apiService.deleteCategory(category).then(function() {
			return apiService.getCategories().then(function(categories) {
				$scope.categories = categories;
			}, function(error) {
				throw error;
			});
		}, function(error) {
			throw error;
		}));
	};
}]);
