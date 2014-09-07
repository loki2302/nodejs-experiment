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
			notes: ["apiService", function(apiService) {
				return apiService.getNotes();
			}]
		}
	});
}])
.controller("NotesController", ["$scope", "$q", "notes", "apiService", function($scope, $q, notes, apiService) {
	$scope.notes = notes;

	$scope.createNote = function(note) {
		return apiService.createNote(note).then(function(note) {
			$scope.notes = apiService.getNotes();
		}, function(error) {
			if(error instanceof apiService.ValidationError) {
				return $q.reject(error.errorMap);
			}
			
			throw error;
		});
	};

	$scope.updateNote = function(note) {
		return apiService.updateNote(note).then(function(note) {
			$scope.notes = apiService.getNotes();			
		}, function(error) {
			if(error instanceof apiService.ValidationError) {
				return $q.reject(error.errorMap);
			}

			throw error;
		});
	};

	$scope.deleteNote = function(note) {
		return apiService.deleteNote(note).then(function() {
			$scope.notes = apiService.getNotes();
		}, function(error) {
			throw error;
		});
	};
}]);
