describe('tbPersonListController', function() {
  beforeEach(module('tbPersonList'));

  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('PersonListController', {
      $scope: scope,
      people: 'test data'
    });
  }));

  it('should publish a message on the scope', function() {
    expect(scope.personListControllerMessage).toBeDefined();
    expect(scope.personListControllerMessage).toBe('hello there test data');
  });
});
