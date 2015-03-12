describe('ApiService', function() {
  beforeEach(module('app'));

  describe('createNote', function() {
    it('should create a note', inject(function($httpBackend, apiService) {
      $httpBackend.expect('POST', '/api/notes').respond(201, {
        id: 123,
        content: 'hello there',
        categories: []
      });

      var onSuccess = jasmine.createSpy('onSuccess');
      apiService.createNote({
        content: 'hello there'
      }).then(onSuccess);

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      expect(onSuccess).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 123,
        content: 'hello there',
        categories: []
      }));
    }));

    it('should throw ValidationError when server returns 400', inject(function($httpBackend, apiService) {
      $httpBackend.expect('POST', '/api/notes').respond(400, {
        content: 'content is empty'
      });

      var onError = jasmine.createSpy('onError');
      apiService.createNote({}).catch(onError);

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      expect(onError).toHaveBeenCalledWith(jasmine.any(apiService.ValidationError));
      expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
        errorMap: {
          content: 'content is empty'
        }
      }));
      expect(onError.calls.count()).toBe(1);
    }));

    it('should throw UnexpectedError when server returns non-400', inject(function($httpBackend, apiService) {
      $httpBackend.expect('POST', '/api/notes').respond(500, {
        message: 'internal server error'
      });

      var onError = jasmine.createSpy('onError');
      apiService.createNote({}).catch(onError);

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      expect(onError).toHaveBeenCalledWith(jasmine.any(apiService.UnexpectedError));
      expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
        message: 'internal server error'
      }));
      expect(onError.calls.count()).toBe(1);
    }));

    it('should throw ConnectivityError when status is 0', inject(function($httpBackend, apiService) {
      // TODO: review what exactly this case look like. Perhaps, the 'data' should be undefined.
      $httpBackend.expect('POST', '/api/notes').respond(0, {});

      var onError = jasmine.createSpy('onError');
      apiService.createNote({}).catch(onError);

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();

      expect(onError).toHaveBeenCalledWith(jasmine.any(apiService.ConnectivityError));
      expect(onError.calls.count()).toBe(1);
    }));
  });  
});
