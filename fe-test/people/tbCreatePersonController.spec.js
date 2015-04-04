describe('tbCreatePerson', function() {
  beforeEach(module('tbCreatePerson', function(apiServiceProvider) {
    apiServiceProvider.apiRoot('/api/');
  }, function($exceptionHandlerProvider) {
    // how do I only apply this to a single test?
    $exceptionHandlerProvider.mode('log');
  }));

  // should I mock all the implicit things?
  var $scope;
  beforeEach(inject(function($controller, $rootScope, $q, $location, execute, apiService, ApiErrors) {
    $scope = $rootScope.$new();
    $controller('CreatePersonController', {
      $scope: $scope,
      $q: $q,
      $location: $location,
      execute: execute,
      apiService: apiService,
      ApiErrors: ApiErrors
    });
  }));

  it('should publish a createPerson() function on the scope', function() {
    expect($scope.createPerson).toBeDefined();
  });

  it('should redirect user to the person page, if the person has been created successfully', inject(function($httpBackend, $location) {
    $httpBackend
      .when('POST', '/api/people')
      .respond(201, {
        id: 123,
        name: 'john'
      });

    var onSuccess = jasmine.createSpy('onSuccess');
    $scope.createPerson({
      name: 'john'
    }).then(onSuccess);

    $httpBackend.flush();

    expect(onSuccess).toHaveBeenCalled();
    expect($location.path()).toBe('/people/123');
  }));

  it('should return an error map if ValidationError appears', inject(function($httpBackend) {
    $httpBackend
      .when('POST', '/api/people')
      .respond(400, {
        name: 'ugly'
      });

    var onError = jasmine.createSpy('onError');
    $scope.createPerson({
      name: 'john'
    }).then(null, onError);

    $httpBackend.flush();

    expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'ugly'
    }));
  }));

  it('should throw if non-ValidationError appears', inject(function($httpBackend, $exceptionHandler, ApiErrors) {
    $httpBackend
      .when('POST', '/api/people')
      .respond(418);

    $scope.createPerson({
      name: 'john'
    });

    $httpBackend.flush();

    expect($exceptionHandler.errors.length).toBe(1);
    // TODO: how do I avoid using the .constructor?
    expect($exceptionHandler.errors[0].constructor).toBe(ApiErrors.UnexpectedError);
  }));
});
