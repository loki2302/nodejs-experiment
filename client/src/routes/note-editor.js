angular.module("directives.notes.noteEditor", [])
.directive("noteEditor", function() {
	return {
		restrict: "E",
		scope: {
			originalNote: "=",	
			save: "&",
			saveTitle: "@",
			displayCancel: "@",
			cancel: "&"
		},
		templateUrl: "note-editor.html",
		link: function(scope, element, attrs, controllers) {
			// how do I design defaults correctly?

			if(scope.originalNote) {
				scope.noteId = scope.originalNote.id;
				scope.noteContent = scope.originalNote.content;
			} else {
				scope.noteContent = "";
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
						content: scope.noteContent
					}
				}).then(function() {
					scope.noteContent = "";
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
});
