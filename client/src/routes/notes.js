angular.module("notes", [
	"ngRoute", 
	"resources.notes", 
	"directives.notes.noteItemView", 
	"directives.notes.noteEditor"
])
.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/notes", {
		templateUrl: "notes.html",
		controller: "NotesController",
		resolve: {
			notes: ["Note", function(Note) {
				return Note.query();
			}]
		}
	});
}])
.controller("NotesController", ["$scope", "$q", "Note", "notes", function($scope, $q, Note, notes) {
	$scope.notes = notes;

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
