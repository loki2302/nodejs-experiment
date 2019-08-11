describe('TeamList', function() {
  beforeEach(module('tbTeamList', 'tbApiService', function(apiServiceProvider) {
    apiServiceProvider.apiRoot('/api');
  }));

  describe('TeamListController', function() {
    var $scope;
    var apiServiceDeleteTeamDeferred;
    beforeEach(inject(function($controller, $rootScope, $q, execute, apiService) {
      $scope = $rootScope.$new();
      $controller('TeamListController', {
        $scope: $scope,
        teams: [
          { id: 1, name: 'team 1' },
          { id: 2, name: 'team 2' }
        ],
        execute: execute,
        apiService: apiService
      });

      apiServiceDeleteTeamDeferred = $q.defer();
      spyOn(apiService, 'deleteTeam').and.callFake(function(team) {
        return apiServiceDeleteTeamDeferred.promise;
      });
    }));

    it('should publish a collection of teams', function() {
      expect($scope.teams).toBeDefined();
    });

    it('should publish a deleteTeam', function() {
      expect($scope.deleteTeam).toBeDefined();
    });

    describe('deleteTeam()', function() {
      it('should throw an error when it fails to update $scope.teams', function() {
        apiServiceDeleteTeamDeferred.resolve();
        $scope.deleteTeam({ id: 3, name: 'team 3' });
        expect(function() {
          $scope.$digest();
        }).toThrow();
      });

      it('should throw an error when apiService.deleteTeam() fails', function() {
        apiServiceDeleteTeamDeferred.reject(new Error());
        $scope.deleteTeam({ id: 3, name: 'team 3' });
        expect(function() {
          $scope.$digest();
        }).toThrow();
      });

      it('should remove the team from $scope.teams when apiService.deleteTeam() succeeds', function() {
        apiServiceDeleteTeamDeferred.resolve();
        $scope.deleteTeam($scope.teams[1]);
        $scope.$digest();
        expect($scope.teams.length).toBe(1);
        expect($scope.teams[0].id).toBe(1);
      });
    });
  });

  it('should register at /teams', inject(function($route) {
    var route = $route.routes['/teams'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('TeamListController');
    expect(route.templateUrl).toBe('teams/teamList.html');
    expect(route.resolve.teams).toBeDefined();
  }));
});
