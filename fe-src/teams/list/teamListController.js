angular.module('tbTeamList', [
  'ngRoute',
  'tbTemplates'
])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/teams', {
    templateUrl: 'teams/list/teamList.html',
    controller: 'TeamListController',
    resolve: {
      teams: [function() {
        return 'resolved data';
      }]
    }
  });
}])
.controller('TeamListController', ['$scope', 'teams', function($scope, teams) {
  $scope.teamListControllerMessage = 'hello there ' + teams;
}]);
