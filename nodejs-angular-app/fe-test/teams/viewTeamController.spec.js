describe('tbViewTeamController', function() {
  beforeEach(module('tbViewTeam'));

  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('ViewTeamController', {
      $scope: scope,
      $location: null,
      execute: null,
      apiService: null,
      team: {
        id: 123,
        name: 'the team'
      }
    });
  }));

  it('should publish a team', function() {
    expect(scope.team).toBeDefined();
    expect(scope.team.id).toBe(123);
    expect(scope.team.name).toBe('the team');
  });

  it('should register at /teams/{id}', inject(function($route) {
    var route = $route.routes['/teams/:id'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('ViewTeamController');
    expect(route.templateUrl).toBe('teams/viewTeam.html');
    expect(route.resolve.team).toBeDefined();
  }));

  describe('deleteTeam()', function() {
    it('should be defined', function() {
      expect(scope.deleteTeam).toBeDefined();
    });
  });
});
