describe('api-service-http', function() {
  beforeEach(module('api2'));

  function testCase(name) { 
    return {
      whenIMakeAnApiCall: function(apiCall) {
        return {
          itSendsTheRequest: function(requestDefinition) {
            return {
              andIfServerRespondsWith: function(responseDefinition) {
                return {
                  aCallSucceedsWith: function(resultDefinition) {
                    it(name, inject(function($httpBackend, apiService2) {
                      $httpBackend
                        .expect(requestDefinition.method, requestDefinition.url)
                        .respond(responseDefinition.status, responseDefinition.body);

                      var onSuccess = jasmine.createSpy('onSuccess');
                      apiCall(apiService2).then(onSuccess);

                      $httpBackend.verifyNoOutstandingExpectation();

                      $httpBackend.flush();
                      $httpBackend.verifyNoOutstandingRequest();

                      expect(onSuccess).toHaveBeenCalledWith(jasmine.objectContaining(resultDefinition));
                    }));
                  },
                  aCallFailsWith: function(resultDefinition) {
                    it(name, inject(function($httpBackend, apiService2) {
                      $httpBackend
                        .expect(requestDefinition.method, requestDefinition.url)
                        .respond(responseDefinition.status, responseDefinition.body);

                      var onError = jasmine.createSpy('onError');
                      apiCall(apiService2).then(null, onError);

                      $httpBackend.verifyNoOutstandingExpectation();

                      $httpBackend.flush();
                      $httpBackend.verifyNoOutstandingRequest();

                      expect(onError).toHaveBeenCalledWith(jasmine.any(resultDefinition()));
                    }));
                  }
                }
              }              
            }
          }
        }
      }
    }
  };

  describe('createNote()', function() {
    var errors;
    beforeEach(inject(function(_errors_) {
      errors = _errors_;
    }));

    testCase('should return created note when 200')
      .whenIMakeAnApiCall(function(api) {
        return api.createNote({
          text: 'hello',
          categories: []
        });
      })
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .andIfServerRespondsWith({ status: 200, body: { id: 123, text: 'hello', categories: [] } })
      .aCallSucceedsWith({ id: 123, text: 'hello', categories: [] });

    testCase('should throw connectivity error when 0')
      .whenIMakeAnApiCall(function(api) {
        return api.createNote({
          text: 'hello',
          categories: []
        });
      })
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .andIfServerRespondsWith({ status: 0 })
      .aCallFailsWith(function() { return errors.ConnectivityError; });

    testCase('should throw validation error when 400')
      .whenIMakeAnApiCall(function(api) {
        return api.createNote({
          text: 'hello',
          categories: []
        });
      })
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .andIfServerRespondsWith({ status: 400 })
      .aCallFailsWith(function() { return errors.ValidationError; });

    testCase('should throw unexpected error when 500')
      .whenIMakeAnApiCall(function(api) {
        return api.createNote({
          text: 'hello',
          categories: []
        });
      })
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .andIfServerRespondsWith({ status: 500 })
      .aCallFailsWith(function() { return errors.UnexpectedError; });      
  });  
});
