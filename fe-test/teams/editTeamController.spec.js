describe('tbEditTeam', function() {
  beforeEach(module('tbEditTeam', function(apiServiceProvider) {
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

    $controller('EditTeamController', {
      $scope: $scope,
      $q: $q,
      $location: $location,
      execute: execute,
      apiService: apiService,
      ApiErrors: ApiErrors,
      team: { id: 123, name: 'the team' }
    });
  }));

  it('should publish an updateTeam() on the scope', function() {
    expect($scope.updateTeam).toBeDefined();
  });

  it('should publish a team on the scope', function() {
    expect($scope.team).toBeDefined();
  });

  it('should publish a findPeopleByQuery() on the scope', function() {
    expect($scope.findPeopleByQuery).toBeDefined();
  });

  it('should call apiService.updateTeam()', function() {
    spyOn(apiService, 'updateTeam').and.callThrough();
    $scope.updateTeam({
      id: 123,
      name: 'the team 2'
    });
    expect(apiService.updateTeam).toHaveBeenCalledWith({
      id: 123,
      name: 'the team 2'
    });
  });

  describe('when apiService.updateTeam() call finishes', function() {
    var apiServiceUpdateTeamDeferred;
    var onSuccess;
    var onError;
    beforeEach(function() {
      apiServiceUpdateTeamDeferred = $q.defer();
      spyOn(apiService, 'updateTeam').and.callFake(function(team) {
        return apiServiceUpdateTeamDeferred.promise;
      });

      onSuccess = jasmine.createSpy('onSuccess');
      onError = jasmine.createSpy('onError');
      $scope.updateTeam({ id: 123, name: 'the team 2' }).then(onSuccess, onError);
    });

    describe('if it finishes successfully', function() {
      beforeEach(function() {
        $scope.$apply(function() {
          apiServiceUpdateTeamDeferred.resolve({ id: 123 });
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
            apiServiceUpdateTeamDeferred.reject(new ApiErrors.ValidationError({
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
          apiServiceUpdateTeamDeferred.reject(new ApiErrors.UnexpectedError());
        });

        it('should re-throw that error', function() {
          expect(function() {
            $scope.$digest();
          }).toThrowError(ApiErrors.UnexpectedError);
        });
      });
    });
  });

  it('should register at /teams/{id}/edit', inject(function($route) {
    var route = $route.routes['/teams/:id/edit'];
    expect(route).toBeDefined();
    expect(route.controller).toBe('EditTeamController');
    expect(route.templateUrl).toBe('teams/editTeam.html');
    expect(route.resolve.team).toBeDefined();
  }));
});
