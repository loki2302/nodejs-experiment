angular.module("notes", ["ngRoute", "resources.notes"])
.config(["$routeProvider", function($routeProvider) {
	$routeProvider.when("/notes", {
		templateUrl: "notes.html",
		controller: "NotesController"
	});
}])
.controller("NotesController", ["$scope", "Note", function($scope, Note) {
	$scope.newNote = {
		content: ""
	};
	$scope.notes = Note.query();
	$scope.message = "hello angular";

	$scope.createNote = function() {
		var content = $scope.newNote.content;
		Note.save({
			content: content
		}, function(value, responseHeaders) {
			console.log("success");
			console.log(value);
			console.log(responseHeaders);

			$scope.notes = Note.query();
		}, function(httpResponse) {
			console.log("error");
			console.log(httpResponse);

			if(httpResponse.status === 400) {
				console.log("server reported validation error");

				var validationErrors = httpResponse.data;
				for(field in validationErrors) {
					console.log("field %s:", field, validationErrors[field]);
				}
			}
		});
	};
}]);
