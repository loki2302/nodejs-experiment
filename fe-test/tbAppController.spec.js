describe('tbAppController', function() {
  beforeEach(module('tbAppController'));

  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('AppController', {
      $scope: scope
    });
  }));

  it('should publish a message on the scope', function() {
    expect(scope.message).toBeDefined();
    expect(scope.message).toBe('hello AppController');
  });
});
