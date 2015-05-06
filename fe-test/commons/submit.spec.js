describe('tbSubmit', function() {
  beforeEach(module('tbSubmit'));

  var $scope;
  beforeEach(inject(function($rootScope, _$compile_, _$q_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $q = _$q_;
  }));

  it('should throw if "exposeErrorsAs" is not set', function() {
    expect(function() {
      $compile(
        '<form tb-submit="handleSubmit()">' +
        '</form>')($scope);
    }).toThrow();
  });

  describe('when the form gets submitted', function() {
    var element;
    var handleSubmitDeferred;
    beforeEach(function() {
      var element = $compile(
        '<form tb-submit="handleSubmit()" expose-errors-as="e">' +
        '  <input type="text" name="username" ng-model="username">' +
        '</form>')($scope);

      handleSubmitDeferred = $q.defer();
      $scope.handleSubmit = jasmine.createSpy('handleSubmit').and.callFake(function() {
        return handleSubmitDeferred.promise;
      });

      element.submit();
    });

    it('it should call tbSubmit', function() {
      expect($scope.handleSubmit).toHaveBeenCalled();
    });

    it('should set no errors if submission is resolved', function() {
      $scope.$apply(function() {
        handleSubmitDeferred.resolve();
      });
      expect($scope.e.isError('username')).toBe(false);
      expect($scope.e.getFieldError('username')).not.toBeDefined();
    });

    it('should set errors if submission is rejected', function() {
      $scope.$apply(function() {
        handleSubmitDeferred.reject({
          username: 'too ugly'
        });
      });
      expect($scope.e.isError('username')).toBe(true);
      expect($scope.e.getFieldError('username')).toBe('too ugly');
    });
  });
});
