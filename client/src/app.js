angular.module("app", [
	"ngRoute", 
	"notes", 
	"categories"])
.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
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
.controller("AppController", ["$scope", "$location", function($scope, $location) {
	$scope.isNavBarActive = function(navBarName) {
		var path = $location.path();
		
		if(path === "/notes" && navBarName === "notes") {
			return true;
		}

		if(path === "/categories" && navBarName === "categories") {
			return true;
		}

		return false;
	};
}]);
