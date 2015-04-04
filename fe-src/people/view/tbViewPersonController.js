angular.module('tbViewPerson', [
  'ngRoute',
  'tbTemplates',
  'tbApiService'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people/:id', {
    template: '<h1>person: {{id}}</h1>',
    controller: 'ViewPersonController',
    resolve: {
      id: ['$route', function($route) {
        return $route.current.params.id;
      }]
    }
  });
}])
.controller('ViewPersonController', [
  '$scope', 'id',
  function($scope, id) {
    $scope.id = id;
  }]
);
