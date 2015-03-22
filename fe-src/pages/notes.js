angular.module("notes", [
	'ngRoute', 
	'directives.notes.newNoteEditor',
	'directives.notes.noteItem',
	'api',
	'operationExecutor'
])
.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when("/notes", {
		templateUrl: 'notes.html',
		controller: "NotesController",
		resolve: {
			notes: ["apiService", function(apiService) {
				return apiService.getNotes();
			}]
		}
	});
}])
.controller('NotesController', 
	['$scope', '$q', 'notes', 'apiService', 'errors', 'execute', 
	function($scope, $q, notes, apiService, errors, execute) {

	$scope.notes = notes;

	$scope.createNote = function(note) {
		return execute(apiService.createNote(note).then(function(note) {
			return $scope.reloadNotes();
		}, function(error) {
			if(error instanceof errors.ValidationError) {
				return $q.reject(error.errorMap);
			}
			
			throw error;
		}));
	};

	$scope.updateNote = function(note) {
		return execute(apiService.updateNote(note).then(function(note) {
			return $scope.reloadNotes();
		}, function(error) {
			if(error instanceof errors.ValidationError) {
				return $q.reject(error.errorMap);
			}

			throw error;
		}));
	};

	$scope.deleteNote = function(note) {
		return execute(apiService.deleteNote(note).then(function() {
			return $scope.reloadNotes();
		}, function(error) {
			throw error;
		}));
	};

	$scope.searchCategoriesStartingWith = function(query) {
		return apiService.getCategoriesWithNameStartingWith(query);
	};

	$scope.reloadNotes = function() {
		return apiService.getNotes().then(function(notes) {
			$scope.notes = notes;
		}, function(error) {
			throw error;
		});
	};
}]);
