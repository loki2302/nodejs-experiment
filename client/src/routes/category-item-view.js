angular.module("directives.categories.categoryItemView", [])
.directive("categoryItemView", function() {
	return {
		restrict: "E",
		scope: {
			category: "=",			
			delete: "&",
			save: "&"
		},
		templateUrl: "category-item-view.html",
		link: function(scope) {
			scope.editing = false;
			scope.working = false;

			scope.deleteCategory = function() {
				scope.working = true;
				scope.delete({
					category: scope.category
				}).then(function() {
					// do I need to do anything when it's deleted?
				}, function() {
					// do I need to display error when delete failed?
				}).finally(function() {
					scope.working = false;
				});
			};

			scope.editCategory = function() {
				scope.editing = true;
			};

			scope.cancelEditCategory = function() {
				scope.editing = false;
			};

			scope.saveCategory = function(category) {
				scope.working = true;
				return scope.save({
					category: category
				}).then(function() {
					scope.editing = false;
				}).finally(function() {
					scope.working = false;
				});
			};
		}
	};
});
