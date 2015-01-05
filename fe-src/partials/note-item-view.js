angular.module("directives.notes.noteItemView", [])
.directive("noteItemView", function() {
	return {
		restrict: "E",
		scope: {
			note: "=",			
			delete: "&",
			save: "&",
			searchCategories: "&",
		},
		templateUrl: "note-item-view.html",
		link: function(scope) {
			scope.editing = false;
			scope.working = false;

			scope.deleteNote = function() {
				scope.working = true;
				scope.delete({
					note: scope.note
				}).then(function() {
					// do I need to do anything when it's deleted?
				}, function() {
					// do I need to display error when delete failed?
				}).finally(function() {
					scope.working = false;
				});
			};

			scope.editNote = function() {
				scope.editing = true;
			};

			scope.cancelEditNote = function() {
				scope.editing = false;
			};

			scope.saveNote = function(note) {
				scope.working = true;
				return scope.save({
					note: note
				}).then(function() {
					scope.editing = false;
				}).finally(function() {
					scope.working = false;
				});
			};
		}
	};
});
