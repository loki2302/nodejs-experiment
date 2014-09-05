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
			save: "&"
		},
		templateUrl: "note-editor.html",
		link: function(scope, element, attrs, controllers) {
			scope.noteContent = "";
			scope.error = "";
			scope.working = false;

			scope.createNote = function() {
				scope.working = true;
				scope.save({
					note: {
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
		}
	};
})
.directive("noteItemView", function() {
	return {
		restrict: "E",
		scope: {
			note: "=",
			delete: "&"
		},
		templateUrl: "note-item-view.html",
		link: function(scope) {
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
