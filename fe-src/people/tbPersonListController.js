angular.module('tbPersonList', [
  'ngRoute',
  'tbTemplates'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people', {
    templateUrl: 'people/personList.html',
    controller: 'PersonListController',
    resolve: {
      people: [function() {
        return 'resolved data';
      }]
    }
  });
}])
.controller('PersonListController', ['$scope', 'people', function($scope, people) {
  $scope.personListControllerMessage = 'hello there ' + people;
}]);
