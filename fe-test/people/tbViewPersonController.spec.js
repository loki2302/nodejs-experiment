describe('tbViewPersonController', function() {
  beforeEach(module('tbViewPerson'));

  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('ViewPersonController', {
      $scope: scope,
      person: {
        id: 123,
        name: 'john'
      }
    });
  }));

  it('should publish a person id', function() {
    expect(scope.person).toBeDefined();
    expect(scope.person.id).toBe(123);
    expect(scope.person.name).toBe('john');
  });
});
