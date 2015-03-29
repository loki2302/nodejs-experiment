describe('Dummy', function() {
  beforeEach(module('tb.app'));

  var scope;
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    $controller('AppController', {
      $scope: scope
    });
  }));

  it('should publish a message on the scope', function() {
    expect(scope.message).to.exist;
    expect(scope.message).to.equal('hello AppController');
  });
});
