angular.module("app", [
	"ngRoute", 
	"notes", 
	"categories",
	"api"])
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

			var noteService = $injector.get("noteService");
			var rootScope = $injector.get("$rootScope");

			if(exception instanceof noteService.ConnectivityError) {
				rootScope.errorMessage = "There's a connectivity issue";
			} else if(exception instanceof noteService.ValidationError) {
				rootScope.errorMessage = "There's a validation error";
			} else if(exception instanceof noteService.UnexpectedError) {
				rootScope.errorMessage = "There's an unexpected API error: " + exception.message;
			} else {
				rootScope.errorMessage = exception.message;
			}
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
