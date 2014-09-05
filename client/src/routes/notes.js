angular.module("notes", ["ngRoute", "resources.notes"])
.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/notes", {
		templateUrl: "notes.html",
		controller: "NotesController"
	});
}])
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
})
.directive("noteItemView", function() {
	return {
		restrict: "E",
		scope: {
			note: "=",			
			delete: "&",
			save: "&"
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
})
.controller("NotesController", ["$scope", "$q", "Note", function($scope, $q, Note) {
	$scope.notes = Note.query();

	$scope.createNote = function(note) {
		var deferred = $q.defer();

		var content = note.content;
		Note.save({
			content: content
		}, function(value, responseHeaders) {
			deferred.resolve();
			$scope.notes = Note.query();
		}, function(httpResponse) {			
			if(httpResponse.status === 400) {
				var validationErrors = httpResponse.data;
				for(field in validationErrors) {
					console.log("validation error %s:", field, validationErrors[field]);
				}

				var errors = {};
				if("content" in validationErrors) {
					errors.content = validationErrors.content[0];
				}

				deferred.reject(errors);

				throw {
					message: "I am exception thrown from NotesController::createNote()"
				};
			} else {
				deferred.reject();
			}
		});

		return deferred.promise;
	};

	$scope.updateNote = function(note) {
		var deferred = $q.defer();

		var id = note.id;
		var content = note.content;
		Note.save({
			id: id,
			content: content
		}, function(value, responseHeaders) {
			deferred.resolve();
			$scope.notes = Note.query();
		}, function(httpResponse) {			
			if(httpResponse.status === 400) {
				var validationErrors = httpResponse.data;
				for(field in validationErrors) {
					console.log("validation error %s:", field, validationErrors[field]);
				}

				var errors = {};
				if("content" in validationErrors) {
					errors.content = validationErrors.content[0];
				}

				deferred.reject(errors);

				throw {
					message: "I am exception thrown from NotesController::createNote()"
				};
			} else {
				deferred.reject();
			}
		});

		return deferred.promise;
	};

	$scope.deleteNote = function(note) {
		var deferred = $q.defer();

		var noteId = note.id;
		Note.delete({
			id: noteId
		}, function(value, responseHeaders) {
			deferred.resolve();
			$scope.notes = Note.query();
		}, function(httpResponse) {
			deferred.reject();
		});

		return deferred.promise;
	};
}]);
