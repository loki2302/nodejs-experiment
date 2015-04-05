describe('tbTeamListController', function() {
  beforeEach(module('tbTeamList'));

  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('TeamListController', {
      $scope: scope,
      teams: 'test data'
    });
  }));

  it('should publish a message on the scope', function() {
    expect(scope.teamListControllerMessage).toBeDefined();
    expect(scope.teamListControllerMessage).toBe('hello there test data');
  });
});
