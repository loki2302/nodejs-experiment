describe('tbOperationExecutor', function() {
  beforeEach(module('tbOperationExecutor'));

  var $rootScope;
  var deferred;
  beforeEach(inject(function(execute, $q, _$rootScope_) {
    $rootScope = _$rootScope_;

    deferred = $q.defer();
    execute(deferred.promise);
  }));

  it('should set "busy" to true as long as the promise is not resolved', function() {
    expect($rootScope.busy).toBe(true);
  });

  it('it should set "busy" to false when the promise is resolved', function() {
    $rootScope.$apply(function() {
      deferred.resolve();
    });
    expect($rootScope.busy).toBe(false);
  });

  it('it should set "busy" to false when the promise is rejected', function() {
    $rootScope.$apply(function() {
      deferred.reject();
    });
    expect($rootScope.busy).toBe(false);
  });
});
