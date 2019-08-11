describe('tbCreateTeam', function() {
  beforeEach(module('tbCreateTeam', function(apiServiceProvider) {
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

    $controller('CreateTeamController', {
      $scope: $scope,
      $q: $q,
      $location: $location,
      execute: execute,
      apiService: apiService,
      ApiErrors: ApiErrors
    });
  }));

  it('should register at /teams/create', inject(function($route) {
    var route = $route.routes['/teams/create'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('CreateTeamController');
    expect(route.templateUrl).toBe('teams/editTeam.html');
  }));

  it('should publish a team on the scope', function() {
    expect($scope.team).toBeDefined();
  });

  it('should publish a pageTitle on a scope', function() {
    expect($scope.pageTitle).toBeDefined();
  });

  it('should publish a submitTitle on a scope', function() {
    expect($scope.submitTitle).toBeDefined();
  });

  describe('submitTeam()', function() {
    it('it should be defined', function() {
      expect($scope.submitTeam).toBeDefined();
    });

    it('should delegate to apiService.createTeam()', function() {
      spyOn(apiService, 'createTeam').and.callThrough();
      $scope.submitTeam({ name: 'the team' });
      expect(apiService.createTeam).toHaveBeenCalledWith({ name: 'the team' });
    });

    describe('when apiService.createTeam() call finishes', function() {
      var apiServiceCreateTeamDeferred;
      var onSuccess;
      var onError;
      beforeEach(function() {
        apiServiceCreateTeamDeferred = $q.defer();
        spyOn(apiService, 'createTeam').and.callFake(function(team) {
          return apiServiceCreateTeamDeferred.promise;
        });

        onSuccess = jasmine.createSpy('onSuccess');
        onError = jasmine.createSpy('onError');
        $scope.submitTeam({ name: 'the team' }).then(onSuccess, onError);
      });

      describe('if it finishes successfully', function() {
        beforeEach(function() {
          $scope.$apply(function() {
            apiServiceCreateTeamDeferred.resolve({ id: 123 });
          });
        });

        it('should resolve the returned promise', function() {
          expect(onSuccess).toHaveBeenCalledWith(undefined);
        });

        it('should redirect the user to /teams/:id', function() {
          expect($location.path()).toBe('/teams/123');
        });
      });

      describe('if it finishes with an error', function() {
        describe('and that error is ValidationError', function() {
          beforeEach(function() {
            $scope.$apply(function() {
              apiServiceCreateTeamDeferred.reject(new ApiErrors.ValidationError({
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
            apiServiceCreateTeamDeferred.reject(new ApiErrors.UnexpectedError());
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

  describe('findPeopleByQuery()', function() {
    it('should be defined', function() {
      expect($scope.findPeopleByQuery).toBeDefined();
    });
  });
});
