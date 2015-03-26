describe('api-service', function() {
  beforeEach(module('api', function(apiServiceProvider) {
    apiServiceProvider.apiRoot('/api/');
  }));

  var errors;
  beforeEach(inject(function(_errors_) {
    errors = _errors_;
  }));

  describe('Notes API', function() {
    describe('createNote()', function() {
      var typicalApiCall = function(api) {
        return api.createNote({
          text: 'hello',
          categories: []
        });
      };

      var typicalRequest = { method: 'POST', url: '/api/notes' };

      it('should do POST /api/notes', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return created note when 201', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 201, body: { id: 123, text: 'hello', categories: [] } })
        .aCallSucceedsWith({ id: 123, text: 'hello', categories: [] })
        .go();
      });

      it('should throw validation error when 400', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 400, body: { content: 'bad content' } })
        .aCallFailsWith(errors.ValidationError, { errorMap: { content: 'bad content' } })
        .go();
      });

      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
    });

    describe('updateNote()', function() {
      var typicalApiCall = function(api) {
        return api.updateNote({
          id: 123,
          text: 'hello',
          categories: []
        });
      };

      var typicalRequest = { method: 'POST', url: '/api/notes/123' };

      it('should do PUT /api/notes/{id}', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return updated note when 200', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 200, body: { id: 123, text: 'hello', categories: [] } })
        .aCallSucceedsWith({ id: 123, text: 'hello', categories: [] })
        .go();
      });

      it('should throw validation error when 400', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 400, body: { content: 'bad content' } })
        .aCallFailsWith(errors.ValidationError, { errorMap: { content: 'bad content' } })
        .go();
      });      

      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowANotFoundErrorWhen404(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
    });

    describe('deleteNote()', function() {
      var typicalApiCall = function(api) {
        return api.deleteNote({
          id: 123,
          text: 'hello',
          categories: []
        });
      };

      var typicalRequest = { method: 'DELETE', url: '/api/notes/123' };

      it('should do DELETE /api/notes/{id}', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return empty result when 200', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 200 })
        .aCallSucceedsWith({})
        .go();
      });

      itShouldThrowANotFoundErrorWhen404(typicalApiCall, typicalRequest);
      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
    });

    describe('getNotes()', function() {
      var typicalApiCall = function(api) {
        return api.getNotes();
      };    

      var typicalRequest = { method: 'GET', url: '/api/notes' };

      it('should do GET /api/notes', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return a collection of notes when 200', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 200, body: [
          { id: 1, content: 'hello', categories: [] },
          { id: 2, content: 'there', categories: [] }
        ]})
        .aCallSucceedsWith([
          { id: 1, content: 'hello', categories: [] },
          { id: 2, content: 'there', categories: [] }
        ])
        .go();
      });

      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
    });
  });

  describe('Categories API', function() {
    describe('createCategory()', function() {
      var typicalApiCall = function(api) {
        return api.createCategory({
          name: 'hello'
        });
      };

      var typicalRequest = { method: 'POST', url: '/api/categories' };

      it('should do POST /api/categories', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return created category when 201', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 201, body: { id: 123, name: 'hello' } })
        .aCallSucceedsWith({ id: 123, name: 'hello' })
        .go();
      });

      it('should throw validation error when 400', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 400, body: { name: 'bad name' } })
        .aCallFailsWith(errors.ValidationError, { errorMap: { name: 'bad name' } })
        .go();
      });

      it('should throw conflict error when 409', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 409 })
        .aCallFailsWith(errors.ConflictError)
        .go();
      });

      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
    });

    describe('updateCategory()', function() {
      var typicalApiCall = function(api) {
        return api.updateCategory({
          id: 123,
          name: 'hello'
        });
      };

      var typicalRequest = { method: 'POST', url: '/api/categories/123' };

      it('should do PUT /api/categories/{id}', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return updated category when 200', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 200, body: { id: 123, name: 'hello' } })
        .aCallSucceedsWith({ id: 123, name: 'hello' })
        .go();
      });

      it('should throw validation error when 400', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 400, body: { name: 'bad name' } })
        .aCallFailsWith(errors.ValidationError, { errorMap: { name: 'bad name' } })
        .go();
      });

      it('should throw conflict error when 409', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 409 })
        .aCallFailsWith(errors.ConflictError)
        .go();
      });

      itShouldThrowANotFoundErrorWhen404(typicalApiCall, typicalRequest);
      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
    });

    describe('deleteCategory()', function() {
      var typicalApiCall = function(api) {
        return api.deleteCategory({
          id: 123
        });
      };

      var typicalRequest = { method: 'DELETE', url: '/api/categories/123' };

      it('should do DELETE /api/categories/{id}', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return empty result when 200', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 200 })
        .aCallSucceedsWith({})
        .go();
      });

      itShouldThrowANotFoundErrorWhen404(typicalApiCall, typicalRequest);
      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
    });

    describe('getCategories()', function() {
      var typicalApiCall = function(api) {
        return api.getCategories();
      };

      var typicalRequest = { method: 'GET', url: '/api/categories' };

      it('should do GET /api/categories', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return a collection of categories when 200', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 200, body: [
          { id: 1, name: 'hello' },
          { id: 2, name: 'there' }
        ]})
        .aCallSucceedsWith([
          { id: 1, name: 'hello' },
          { id: 2, name: 'there' }
        ])
        .go();
      });

      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
    });

    describe('getCategoriesWithNameStartingWith()', function() {
      var typicalApiCall = function(api) {
        return api.getCategoriesWithNameStartingWith('omg');
      };

      var typicalRequest = { method: 'GET', url: '/api/categories?nameStartsWith=omg' };

      it('should do GET /api/categories?nameStartsWith={nsw}', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .go();
      });

      it('should return a collection of categories when 200', function() {
        whenIMakeAnApiCall(typicalApiCall)
        .itSendsTheRequest(typicalRequest)
        .andIfServerRespondsWith({ status: 200, body: [
          { id: 1, name: 'hello' },
          { id: 2, name: 'there' }
        ]})
        .aCallSucceedsWith([
          { id: 1, name: 'hello' },
          { id: 2, name: 'there' }
        ])
        .go();
      });

      itShouldThrowAConnectivityErrorWhen0(typicalApiCall, typicalRequest);
      itShouldThrowAnUnexpectedErrorWhen500(typicalApiCall, typicalRequest);
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
            inject(function($httpBackend, apiService) {
              $httpBackend
                .expect(requestDefinition.method, requestDefinition.url)
                .respond(0);
              
              apiCall(apiService);
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
                    inject(function($httpBackend, apiService) {
                      $httpBackend
                        .when(requestDefinition.method, requestDefinition.url)
                        .respond(responseDefinition.status, responseDefinition.body);

                      var onSuccess = jasmine.createSpy('onSuccess');
                      apiCall(apiService).then(onSuccess);

                      $httpBackend.flush();
                      $httpBackend.verifyNoOutstandingRequest();

                      expect(onSuccess).toHaveBeenCalledWith(jasmine.objectContaining(resultDefinition));
                    });
                  }
                }
              },
              aCallFailsWith: function(errorType, containing) {
                return {
                  go: function() {
                    inject(function($httpBackend, apiService) {
                      $httpBackend
                        .when(requestDefinition.method, requestDefinition.url)
                        .respond(responseDefinition.status, responseDefinition.body);

                      var onError = jasmine.createSpy('onError');
                      apiCall(apiService).then(null, onError);

                      $httpBackend.flush();
                      $httpBackend.verifyNoOutstandingRequest();

                      expect(onError).toHaveBeenCalledWith(jasmine.any(errorType));

                      if(containing) {
                        if(!angular.isObject(containing)) throw new Error();
                        expect(onError).toHaveBeenCalledWith(jasmine.objectContaining(containing));
                      }
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

  function itShouldThrowAConnectivityErrorWhen0(apiCall, apiRequest) {
    it('should throw connectivity error when 0', function() {
      whenIMakeAnApiCall(apiCall)
      .itSendsTheRequest(apiRequest)
      .andIfServerRespondsWith({ status: 0 })
      .aCallFailsWith(errors.ConnectivityError)
      .go();
    });
  };

  function itShouldThrowANotFoundErrorWhen404(apiCall, apiRequest) {
    it('should throw not found error when 404', function() {
      whenIMakeAnApiCall(apiCall)
      .itSendsTheRequest(apiRequest)
      .andIfServerRespondsWith({ status: 404 })
      .aCallFailsWith(errors.NotFoundError)
      .go();
    });
  };

  function itShouldThrowAnUnexpectedErrorWhen500(apiCall, apiRequest) {
    it('should throw unexpected error when 500', function() {
      whenIMakeAnApiCall(apiCall)
      .itSendsTheRequest(apiRequest)
      .andIfServerRespondsWith({ status: 500 })
      .aCallFailsWith(errors.UnexpectedError)
      .go();
    });
  };
});
