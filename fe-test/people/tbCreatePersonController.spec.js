describe('tbCreatePerson', function() {
  beforeEach(module('tbCreatePerson', function(apiServiceProvider) {
    apiServiceProvider.apiRoot('/api/');
  }));

  var $scope;
  var $q;
  var $location;
  var apiService;
  var ApiErrors;
  beforeEach(inject(function($controller, $rootScope, _$q_, _$location_, execute, _apiService_, _ApiErrors_) {
    $scope = $rootScope.$new();
    $q = _$q_;
    $location = _$location_;

    apiService = _apiService_;
    ApiErrors = _ApiErrors_;

    $controller('CreatePersonController', {
      $scope: $scope,
      $q: $q,
      $location: $location,
      execute: execute,
      apiService: apiService,
      ApiErrors: ApiErrors
    });
  }));

  it('should publish a createPerson() on the scope', function() {
    expect($scope.createPerson).toBeDefined();
  });

  it('should call apiService.createPerson()', function() {
    spyOn(apiService, 'createPerson').and.callThrough();
    $scope.createPerson({ name: 'john' });
    expect(apiService.createPerson).toHaveBeenCalledWith({ name: 'john' });
  });

  describe('when apiService.createPerson() call finishes', function() {
    var apiServiceCreatePersonDeferred;
    var onSuccess;
    var onError;
    beforeEach(function() {
      apiServiceCreatePersonDeferred = $q.defer();
      spyOn(apiService, 'createPerson').and.callFake(function(person) {
        return apiServiceCreatePersonDeferred.promise;
      });

      onSuccess = jasmine.createSpy('onSuccess');
      onError = jasmine.createSpy('onError');
      $scope.createPerson({ name: 'john' }).then(onSuccess, onError);
    });

    describe('if it finishes successfully', function() {
      beforeEach(function() {
        $scope.$apply(function() {
          apiServiceCreatePersonDeferred.resolve({ id: 123 });
        });
      });

      it('should resolve the returned promise', function() {
        expect(onSuccess).toHaveBeenCalledWith(undefined);
      });

      it('should redirect the user to /people/:id', function() {
        expect($location.path()).toBe('/people/123');
      });
    });

    describe('if it finishes with an error', function() {
      describe('and that error is ValidationError', function() {
        beforeEach(function() {
          $scope.$apply(function() {
            apiServiceCreatePersonDeferred.reject(new ApiErrors.ValidationError({
              name: 'ugly'
            }));
          });
        });

        it('should reject the returned promise with field error map', function() {
          expect(onError).toHaveBeenCalledWith({
            name: 'ugly'
          });
        });
      });

      describe('and that error is NOT ValidationError', function() {
        beforeEach(function() {
          // this call is outside the digest context by intention
          apiServiceCreatePersonDeferred.reject(new ApiErrors.UnexpectedError());
        });

        it('should re-throw that error', function() {
          expect(function() {
            $scope.$digest();
          }).toThrowError(ApiErrors.UnexpectedError);
        });
      });
    });
  });

  it('should register at /people/create', inject(function($route) {
    var route = $route.routes['/people/create'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('CreatePersonController');
    expect(route.templateUrl).toBe('people/create/createPerson.html');
  }));
});
