angular.module("resources.notes", ["ngResource"])
.factory("Note", ["$resource", function($resource) {
	return $resource("/notes/:noteId", {}, {
		query: {
			method: "GET",
			isArray: true
		}
	});
}]);
