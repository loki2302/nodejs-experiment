angular.module("app").factory("Note", ["$resource", function($resource) {
	return $resource("/notes/:noteId", {}, {
		query: {
			method: "GET",
			isArray: true
		}
	});
}]);
