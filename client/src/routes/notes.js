angular.module("notes", [
	"ngRoute", 
	"directives.notes.noteItemView", 
	"directives.notes.noteEditor",
	"api"
])
.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/notes", {
		templateUrl: "notes.html",
		controller: "NotesController",
		resolve: {
			notes: ["noteService", function(noteService) {
				return noteService.getNotes();
			}]
		}
	});
}])
.controller("NotesController", ["$scope", "$q", "notes", "noteService", function($scope, $q, notes, noteService) {
	$scope.notes = notes;

	$scope.createNote = function(note) {
		return noteService.createNote(note).then(function(note) {
			$scope.notes = noteService.getNotes();
		}, function(error) {
			if(error instanceof noteService.ValidationError) {
				return $q.reject(error.errorMap);
			}
			
			throw error;
		});
	};

	$scope.updateNote = function(note) {
		return noteService.updateNote(note).then(function(note) {
			$scope.notes = noteService.getNotes();			
		}, function(error) {
			if(error instanceof noteService.ValidationError) {
				return $q.reject(error.errorMap);
			}

			throw error;
		});
	};

	$scope.deleteNote = function(note) {
		return noteService.deleteNote(note).then(function() {
			$scope.notes = noteService.getNotes();
		}, function(error) {
			throw error;
		});
	};
}]);
