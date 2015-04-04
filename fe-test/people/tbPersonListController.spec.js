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

  it('should publish a collection of people', function() {
    expect(scope.people).toBeDefined();
  });
});
