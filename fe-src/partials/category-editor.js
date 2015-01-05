angular.module("directives.categories.categoryEditor", [])
.directive("categoryEditor", function() {
	return {
		restrict: "E",
		scope: {
			originalCategory: "=",	
			save: "&",
			saveTitle: "@",
			displayCancel: "@",
			cancel: "&"
		},
		templateUrl: "category-editor.html",
		link: function(scope, element, attrs, controllers) {
			// how do I design defaults correctly?

			if(scope.originalCategory) {
				scope.categoryId = scope.originalCategory.id;
				scope.categoryName = scope.originalCategory.name;
			} else {
				scope.categoryName = "";
			}

			if(!scope.displayCancel) {
				scope.displayCancel = false;
			}

			scope.error = "";
			scope.working = false;

			scope.createCategory = function() {
				scope.working = true;
				scope.save({
					category: {
						id: scope.categoryId,
						name: scope.categoryName
					}
				}).then(function() {
					scope.categoryName = "";
					scope.error = "";
				}, function(errors) {
					if(errors) {
						scope.error = errors.name;
					} else {
						scope.error = "It didn't work";
					}
				}).finally(function() {
					scope.working = false;
				});
			};

			scope.cancelClicked = function() {
				scope.cancel();
			};
		}
	};
});
