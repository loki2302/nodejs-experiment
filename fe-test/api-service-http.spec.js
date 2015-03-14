describe('api-service-http', function() {
  beforeEach(module('api2'));
  
  describe('createNote()', function() {
    var typicalApiCall = function(api) {
      return api.createNote({
        text: 'hello',
        categories: []
      });
    };

    var errors;
    beforeEach(inject(function(_errors_) {
      errors = _errors_;
    }));

    it('should do POST /api/notes', function() {
      whenIMakeAnApiCall(typicalApiCall)
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .go();
    });

    it('should return created note when 200', function() {
      whenIMakeAnApiCall(typicalApiCall)
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .andIfServerRespondsWith({ status: 200, body: { id: 123, text: 'hello', categories: [] } })
      .aCallSucceedsWith({ id: 123, text: 'hello', categories: [] })
      .go();
    });

    it('should throw connectivity error when 0', function() {
      whenIMakeAnApiCall(typicalApiCall)
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .andIfServerRespondsWith({ status: 0 })
      .aCallFailsWith(errors.ConnectivityError)
      .go();
    });

    it('should throw validation error when 400', function() {
      whenIMakeAnApiCall(typicalApiCall)
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .andIfServerRespondsWith({ status: 400, body: { errorMap: { content: 'bad content' } } })
      .aCallFailsWith(errors.ValidationError)
      .go();
    });

    it('should throw unexpected error when 500', function() {
      whenIMakeAnApiCall(typicalApiCall)
      .itSendsTheRequest({ method: 'POST', url: '/api/notes' })
      .andIfServerRespondsWith({ status: 500 })
      .aCallFailsWith(errors.UnexpectedError)
      .go();
    });
  });

  function whenIMakeAnApiCall(apiCall) {
    if(!apiCall) throw new Error();

    return {
      itSendsTheRequest: function(requestDefinition) {
        if(!requestDefinition) throw new Error();
        if(!requestDefinition.method) throw new Error();
        if(!requestDefinition.url) throw new Error();

        return {
          go: function() {
            inject(function($httpBackend, apiService2) {
              $httpBackend
                .expect(requestDefinition.method, requestDefinition.url)
                .respond(0);
              
              apiCall(apiService2);
              $httpBackend.verifyNoOutstandingExpectation();
            });
          },
          andIfServerRespondsWith: function(responseDefinition) {
            if(!responseDefinition) throw new Error();
            if(responseDefinition.status !== 0 && !responseDefinition.status) throw new Error();

            return {
              aCallSucceedsWith: function(resultDefinition) {
                if(!resultDefinition) throw new Error();

                return {
                  go: function() {
                    inject(function($httpBackend, apiService2) {
                      $httpBackend
                        .when(requestDefinition.method, requestDefinition.url)
                        .respond(responseDefinition.status, responseDefinition.body);

                      var onSuccess = jasmine.createSpy('onSuccess');
                      apiCall(apiService2).then(onSuccess);

                      $httpBackend.flush();
                      $httpBackend.verifyNoOutstandingRequest();

                      expect(onSuccess).toHaveBeenCalledWith(jasmine.objectContaining(resultDefinition));
                    });
                  }
                }
              },
              aCallFailsWith: function(errorDefinition) {
                return {
                  go: function() {
                    inject(function($httpBackend, apiService2) {
                      $httpBackend
                        .when(requestDefinition.method, requestDefinition.url)
                        .respond(responseDefinition.status, responseDefinition.body);

                      var onError = jasmine.createSpy('onError');
                      apiCall(apiService2).then(null, onError);

                      $httpBackend.flush();
                      $httpBackend.verifyNoOutstandingRequest();

                      expect(onError).toHaveBeenCalledWith(jasmine.any(errorDefinition));
                    });
                  }
                };
              }
            }
          }              
        }
      }
    }
  };
});
