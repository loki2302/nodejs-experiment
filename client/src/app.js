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
	$provide.decorator("$exceptionHandler", ["$delegate", "$injector", function($delegate, $injector) {
		return function(exception, cause) {
			$delegate(exception, cause);
			var rootScope = $injector.get("$rootScope");

			var errorMessage = exception.message;
			rootScope.errorMessage = errorMessage;
			console.log("My exception handler: %s", errorMessage);
		};
	}]);
}])
.controller("AppController", ["$scope", function($scope) {	
}]);
