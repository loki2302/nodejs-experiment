angular.module('tbOtherwiseController', [
  'ngRoute'
]).config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({
    template: '',
    controller: 'OtherwiseController'
  });
}]).controller('OtherwiseController', ['$rootScope', function($rootScope) {
  $rootScope.error = true;
}]);
