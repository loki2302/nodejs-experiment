describe('api-service-http', function() {
  beforeEach(module('api2'));

  describe('createNote()', function() {
    it('should return created note when 200', inject(function($httpBackend, apiService2) {
      $httpBackend.expect('POST', '/api/notes').respond(200, {
        id: 123,
        text: 'hello',
        categories: []
      });

      var onSuccess = jasmine.createSpy('onSuccess');
      apiService2.createNote({
        text: 'hello',
        categories: []
      }).then(onSuccess);

      $httpBackend.verifyNoOutstandingExpectation();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingRequest();

      expect(onSuccess).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 123,
        text: 'hello',
        categories: []
      }));
    }));

    it('should throw connectivity error when 0', inject(function($httpBackend, apiService2, errors) {
      $httpBackend.expect('POST', '/api/notes').respond(0, {});

      var onError = jasmine.createSpy('onError');
      apiService2.createNote({
        text: 'hello',
        categories: []
      }).then(null, onError);

      $httpBackend.verifyNoOutstandingExpectation();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingRequest();

      expect(onError).toHaveBeenCalledWith(jasmine.any(errors.ConnectivityError));
    }));

    it('should throw validation error when 400', inject(function($httpBackend, apiService2, errors) {
      $httpBackend.expect('POST', '/api/notes').respond(400, {});

      var onError = jasmine.createSpy('onError');
      apiService2.createNote({
        text: 'hello',
        categories: []
      }).then(null, onError);

      $httpBackend.verifyNoOutstandingExpectation();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingRequest();

      expect(onError).toHaveBeenCalledWith(jasmine.any(errors.ValidationError));
    }));

    it('should throw unexpected error when 500', inject(function($httpBackend, apiService2, errors) {
      $httpBackend.expect('POST', '/api/notes').respond(500, {});

      var onError = jasmine.createSpy('onError');
      apiService2.createNote({
        text: 'hello',
        categories: []
      }).then(null, onError);

      $httpBackend.verifyNoOutstandingExpectation();

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingRequest();

      expect(onError).toHaveBeenCalledWith(jasmine.any(errors.UnexpectedError));
    }));
  });  
});
