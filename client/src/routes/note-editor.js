angular.module("directives.notes.noteEditor", ["ngTagsInput"])
.directive("noteEditor", ["$q", function($q) {
	return {
		restrict: "E",
		scope: {
			originalNote: "=",	
			save: "&",
			saveTitle: "@",
			displayCancel: "@",
			cancel: "&",
			searchCategories: "&"
		},
		templateUrl: "note-editor.html",
		link: function(scope, element, attrs, controllers) {
			// how do I design defaults correctly?

			if(scope.originalNote) {
				scope.noteId = scope.originalNote.id;
				scope.noteContent = scope.originalNote.content;
				scope.noteCategories = scope.originalNote.categories;
			} else {
				scope.noteContent = "";
				scope.noteCategories = [];
			}

			if(!scope.displayCancel) {
				scope.displayCancel = false;
			}

			scope.error = "";
			scope.working = false;

			scope.createNote = function() {
				scope.working = true;
				scope.save({
					note: {
						id: scope.noteId,
						content: scope.noteContent,
						categories: scope.noteCategories
					}
				}).then(function() {
					scope.noteContent = "";
					scope.noteCategories = [];
					scope.error = "";
				}, function(errors) {
					if(errors) {
						scope.error = errors.content;
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
}]);
