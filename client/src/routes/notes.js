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
				}, function() {
					scope.error = "It didn't work";
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
			deferred.reject();
			if(httpResponse.status === 400) {
				var validationErrors = httpResponse.data;
				for(field in validationErrors) {
					console.log("validation error %s:", field, validationErrors[field]);
				}

				throw {
					message: "I am exception thrown from NotesController::createNote()"
				};
			}
		});

		return deferred.promise;
	};

	$scope.deleteNote = function(noteId) {
		console.log("delete note");
		console.log(noteId);
		Note.delete({
			id: noteId
		}, function(value, responseHeaders) {
			console.log("success");
			console.log(value);
			console.log(responseHeaders);

			$scope.notes = Note.query();
		}, function(httpResponse) {
			console.log("error");
			console.log(httpResponse);
		});
	};
}]);
