angular.module("app", [
	"ngRoute", 
	"notes", 
	"categories"])
.config(["$routeProvider", function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo: "/notes"
	});
}]);
