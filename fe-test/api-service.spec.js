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

    it('should throw ValidationException when server returns 400', inject(function($httpBackend, apiService) {
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
  });  
});
