angular.module("app", [
	"ngRoute", 
	"notes", 
	"categories"])
.config(["$routeProvider", function($routeProvider) {
	$routeProvider.otherwise({
		redirectTo: "/notes"
	});
}])
.config(["$provide", function($provide) {
	$provide.decorator("$exceptionHandler", ["$delegate", function($delegate) {
		return function(exception, cause) {
			$delegate(exception, cause);
			console.log("My exception handler: %s", exception.message);
		};
	}]);
}]);
