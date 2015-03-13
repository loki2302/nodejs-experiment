describe('ApiService', function() {
  beforeEach(module('app'));

  function itShouldSendACorrectRequest(requestDescription) {
    it('should send a correct request', inject(function($httpBackend, apiService) {
      var requestDetails = requestDescription.theRequestIsExpectedToBeLikeThis;
      $httpBackend.expect(requestDetails.method, requestDetails.url, function(data) {
        var body = JSON.parse(data);
        expect(body).toEqual(requestDetails.data);
        return true;
      }).respond(200, {});

      var apiCallFunc = requestDescription.whenIMakeACallLikeThis;
      apiCallFunc(apiService);

      $httpBackend.flush();
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    }));
  };

  function describeApi(methodName, requestDescription) {
    if(!requestDescription) throw new Error();
    if(!requestDescription.whenIMakeACallLikeThis) throw new Error();
    if(!requestDescription.theRequestIsExpectedToBeLikeThis) throw new Error();
    if(!requestDescription.theRequestIsExpectedToBeLikeThis.method) throw new Error();
    if(!requestDescription.theRequestIsExpectedToBeLikeThis.url) throw new Error();
    if(!requestDescription.theRequestIsExpectedToBeLikeThis.data) throw new Error();    
    if(!requestDescription.the200ResponseIsExpectedToBeLikeThis) throw new Error();
    if(!requestDescription.the400ResponseIsExpectedToBeLikeThis) throw new Error();
    
    describe(methodName + ' API', function() {
      itShouldSendACorrectRequest(requestDescription);

      it('should handle a 200 response', inject(function($httpBackend, apiService) {
        var requestDetails = requestDescription.theRequestIsExpectedToBeLikeThis;
        var expectedResponse = requestDescription.the200ResponseIsExpectedToBeLikeThis;
        $httpBackend.when(requestDetails.method, requestDetails.url).respond(200, expectedResponse);

        var onSuccess = jasmine.createSpy('onSuccess');
        var apiCallFunc = requestDescription.whenIMakeACallLikeThis;
        apiCallFunc(apiService).then(onSuccess);

        $httpBackend.flush();
        
        expect(onSuccess).toHaveBeenCalledWith(jasmine.objectContaining(expectedResponse));
        expect(onSuccess.calls.count()).toBe(1);

        $httpBackend.verifyNoOutstandingRequest();
      }));

      it('should handle a 400 response', inject(function($httpBackend, apiService) {
        var requestDetails = requestDescription.theRequestIsExpectedToBeLikeThis;
        var expectedResponse = requestDescription.the400ResponseIsExpectedToBeLikeThis;
        $httpBackend.when(requestDetails.method, requestDetails.url).respond(400, expectedResponse);

        var onError = jasmine.createSpy('onError');
        var apiCallFunc = requestDescription.whenIMakeACallLikeThis;
        apiCallFunc(apiService).catch(onError);

        $httpBackend.flush();

        expect(onError).toHaveBeenCalledWith(jasmine.any(apiService.ValidationError));
        expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
          errorMap: expectedResponse
        }));
        expect(onError.calls.count()).toBe(1);

        $httpBackend.verifyNoOutstandingRequest();
      }));

      it('should handle a connectivity error', inject(function($httpBackend, apiService) {
        var requestDetails = requestDescription.theRequestIsExpectedToBeLikeThis;
        $httpBackend.when(requestDetails.method, requestDetails.url).respond(0, {});

        var onError = jasmine.createSpy('onError');
        var apiCallFunc = requestDescription.whenIMakeACallLikeThis;
        apiCallFunc(apiService).catch(onError);

        $httpBackend.flush();      

        expect(onError).toHaveBeenCalledWith(jasmine.any(apiService.ConnectivityError));
        expect(onError.calls.count()).toBe(1);

        $httpBackend.verifyNoOutstandingRequest();
      }));
    });
  };

  describeApi('createNote', {
    whenIMakeACallLikeThis: function(apiService) {
      return apiService.createNote({
        content: 'hello there'
      });
    },
    theRequestIsExpectedToBeLikeThis: {
      method: 'POST',
      url: '/api/notes',
      data: {
        content: 'hello there'
      }    
    },
    the200ResponseIsExpectedToBeLikeThis: {
      content: 'hello there'
    },
    the400ResponseIsExpectedToBeLikeThis: {
      content: 'content is empty'
    }
  });

  describeApi('createCategory', {
    whenIMakeACallLikeThis: function(apiService) {
      return apiService.createCategory({
        name: 'java'
      });
    },
    theRequestIsExpectedToBeLikeThis: {
      method: 'POST',
      url: '/api/categories',
      data: {
        name: 'java'
      }    
    },
    the200ResponseIsExpectedToBeLikeThis: {
      id: 123,
      name: 'java'
    },
    the400ResponseIsExpectedToBeLikeThis: {
      name: 'bad name'
    }
  });
});
