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
        return [
          { id: 1, name: 'John Smith' },
          { id: 2, name: 'Bill Gates' },
          { id: 3, name: 'Steve Jobs' },
          { id: 4, name: 'Sergey Brin' },
          { id: 5, name: 'Elon Musk' }
        ];
      }]
    }
  });
}])
.controller('PersonListController', ['$scope', 'people', function($scope, people) {
  $scope.people = people;
}]);
