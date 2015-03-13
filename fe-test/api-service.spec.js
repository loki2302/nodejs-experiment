describe('ApiService', function() {
  beforeEach(module('app'));

  describe('createNote', function() {
    it('should send a correct request', inject(function($httpBackend, apiService) {
      $httpBackend.expect('POST', '/api/notes', function(data) {
        var body = JSON.parse(data);
        expect(body).toEqual({
          content: 'hello there'
        });
        return true;
      }).respond(201, {});

      apiService.createNote({
        content: 'hello there'
      });

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should handle a 200 response', inject(function($httpBackend, apiService) {
      $httpBackend.when('POST', '/api/notes').respond(201, {
        id: 123,
        content: 'hello there',
        categories: []
      });

      var onSuccess = jasmine.createSpy('onSuccess');
      apiService.createNote({
        content: 'hello there'
      }).then(onSuccess);

      $httpBackend.flush();      

      expect(onSuccess).toHaveBeenCalledWith(jasmine.objectContaining({
        id: 123,
        content: 'hello there',
        categories: []
      }));
      expect(onSuccess.calls.count()).toBe(1);

      $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should handle a 400 response', inject(function($httpBackend, apiService) {
      $httpBackend.when('POST', '/api/notes').respond(400, {
        content: 'content is empty'
      });

      var onError = jasmine.createSpy('onError');
      apiService.createNote({}).catch(onError);

      $httpBackend.flush();      

      expect(onError).toHaveBeenCalledWith(jasmine.any(apiService.ValidationError));
      expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
        errorMap: {
          content: 'content is empty'
        }
      }));
      expect(onError.calls.count()).toBe(1);

      $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should handle a connectivity error', inject(function($httpBackend, apiService) {
      $httpBackend.when('POST', '/api/notes').respond(0, {});

      var onError = jasmine.createSpy('onError');
      apiService.createNote({}).catch(onError);

      $httpBackend.flush();      

      expect(onError).toHaveBeenCalledWith(jasmine.any(apiService.ConnectivityError));
      expect(onError.calls.count()).toBe(1);

      $httpBackend.verifyNoOutstandingRequest();
    }));
  });  
});
