describe('tbViewPersonController', function() {
  beforeEach(module('tbViewPerson'));

  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('ViewPersonController', {
      $scope: scope,
      id: 123
    });
  }));

  it('should publish a person id', function() {
    expect(scope.id).toBeDefined();
    expect(scope.id).toBe(123);
  });
});
