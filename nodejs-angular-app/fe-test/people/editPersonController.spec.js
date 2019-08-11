describe('tbEditPerson', function() {
  beforeEach(module('tbEditPerson', function(apiServiceProvider) {
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

    $controller('EditPersonController', {
      $scope: $scope,
      $q: $q,
      $location: $location,
      execute: execute,
      apiService: apiService,
      ApiErrors: ApiErrors,
      person: { id: 123, name: 'john' }
    });
  }));

  it('should register at /people/{id}/edit', inject(function($route) {
    var route = $route.routes['/people/:id/edit'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('EditPersonController');
    expect(route.templateUrl).toBe('people/editPerson.html');
    expect(route.resolve.person).toBeDefined();
  }));

  it('should publish a person on the scope', function() {
    expect($scope.person).toBeDefined();
  });

  it('should publish a pageTitle on the scope', function() {
    expect($scope.pageTitle).toBeDefined();
  });

  it('should publish a submitTitle on the scope', function() {
    expect($scope.pageTitle).toBeDefined();
  });

  describe('submitPerson()', function() {
    it('should be defined', function() {
      expect($scope.submitPerson).toBeDefined();
    });

    it('should delegate to apiService.updatePerson()', function() {
      spyOn(apiService, 'updatePerson').and.callThrough();
      $scope.submitPerson({
        id: 123,
        name: 'john1'
      });
      expect(apiService.updatePerson).toHaveBeenCalledWith({
        id: 123,
        name: 'john1'
      });
    });

    describe('when apiService.updatePerson() call finishes', function() {
      var apiServiceUpdatePersonDeferred;
      var onSuccess;
      var onError;
      beforeEach(function() {
        apiServiceUpdatePersonDeferred = $q.defer();
        spyOn(apiService, 'updatePerson').and.callFake(function(person) {
          return apiServiceUpdatePersonDeferred.promise;
        });

        onSuccess = jasmine.createSpy('onSuccess');
        onError = jasmine.createSpy('onError');
        $scope.submitPerson({ id: 123, name: 'john' }).then(onSuccess, onError);
      });

      describe('if it finishes successfully', function() {
        beforeEach(function() {
          $scope.$apply(function() {
            apiServiceUpdatePersonDeferred.resolve({ id: 123 });
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
              apiServiceUpdatePersonDeferred.reject(new ApiErrors.ValidationError({
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
            apiServiceUpdatePersonDeferred.reject(new ApiErrors.UnexpectedError());
          });

          it('should re-throw that error', function() {
            expect(function() {
              $scope.$digest();
            }).toThrowError(ApiErrors.UnexpectedError);
          });
        });
      });
    });
  });

  describe('randomizeAvatar()', function() {
    it('should be defined', function() {
      expect($scope.randomizeAvatar).toBeDefined();
    });
  });

  describe('findTeamsByQuery()', function() {
    it('should be defined', function() {
      expect($scope.findTeamsByQuery).toBeDefined();
    });
  });
});
