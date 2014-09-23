angular.module("resources.notes", ["ngResource"])
.factory("Note", ["$resource", function($resource) {
	return $resource("/api/notes/:id", {
		id: "@id"
	}, {
		query: {
			method: "GET",
			isArray: true
		}
	});
}]);
