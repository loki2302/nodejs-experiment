describe('tbValidationFacade', function() {
  beforeEach(module('tbValidationFacade'));

  var $scope;
  beforeEach(inject(function($rootScope, $compile) {
    $scope = $rootScope.$new();

    $compile(
      '<form tb-validation-facade="vf">' +
      '  <input type="text" name="username" ng-model="username">' +
      '  <input type="text" name="password" ng-model="password">' +
      '</form>'
      )($scope);
    $scope.username = 'hello';
    $scope.password = 'there';
    $scope.$digest();
  }));

  it('should publish a validation facade on the related scope', function() {
    expect($scope.vf).toBeDefined();
    expect($scope.vf.setAllFieldsValid).toBeDefined();
    expect($scope.vf.setFieldErrors).toBeDefined();
    expect($scope.vf.getFieldError).toBeDefined();
    expect($scope.vf.isError).toBeDefined();
  });

  it('should treat fields as "valid" by default', function() {
    expect($scope.vf.isError('username')).toBe(false);
    expect($scope.vf.isError('password')).toBe(false);
  });

  it('should allow specifying the error map', function() {
    $scope.vf.setFieldErrors({
      password: 'very invalid'
    });

    expect($scope.vf.isError('username')).toBe(false);
    expect($scope.vf.isError('password')).toBe(true);
    expect($scope.vf.getFieldError('password')).toBe('very invalid');
  });

  it('should throw when error map has the unknown fields', function() {
    expect(function() {
      $scope.vf.setFieldErrors({
        iLikeCats: 'yes I do'
      });
    }).toThrowError(/iLikeCats/);
  });

  it('should allow cleaning up the error map', function() {
    $scope.vf.setFieldErrors({
      username: 'too ugly',
      password: 'very invalid'
    });
    $scope.vf.setAllFieldsValid();

    expect($scope.vf.isError('username')).toBe(false);
    expect($scope.vf.isError('password')).toBe(false);
  });
});
