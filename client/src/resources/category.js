angular.module("resources.categories", ["ngResource"])
.factory("Category", ["$resource", function($resource) {
	return $resource("/api/categories/:id", {
		id: "@id"
	}, {
		query: {
			method: "GET",
			isArray: true
		}
	});
}]);
