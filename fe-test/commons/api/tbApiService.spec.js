describe('tbApiService initialization', function() {
  it('should be impossible to construct when apiRoot is not configured', function() {
    var $injector = angular.injector(['tbApiService', 'ngMock']);
    expect(function() {
      $injector.get('apiService');
    }).toThrowError(/apiRoot/);
  });

  it('should be possible to construc when apiRoot is configured', function() {
    var $injector = angular.injector(['tbApiService', 'ngMock', function(apiServiceProvider) {
      apiServiceProvider.apiRoot('http://example.com');
    }]);
    expect(function() {
      $injector.get('apiService');
    }).not.toThrow();
  });
});

describe('tbApiService', function() {
   beforeEach(module('tbApiService', function(apiServiceProvider) {
     apiServiceProvider.apiRoot('/api/');
   }));

   var $httpBackend;
   var apiService;
   var ApiErrors;
   var onSuccess;
   var onError;
   beforeEach(inject(function(_$httpBackend_, _apiService_, _ApiErrors_) {
     $httpBackend = _$httpBackend_;
     apiService = _apiService_;
     ApiErrors = _ApiErrors_;

     onSuccess = jasmine.createSpy('onSuccess');
     onError = jasmine.createSpy('onError');
   }));

   describe('createPerson()', function() {
     function makeApiCall() {
       apiService.createPerson({
         name: 'john'
       }).then(onSuccess, onError);
     };

     it('should do the POST /api/people', function() {
       $httpBackend.expect('POST', '/api/people').respond(0);
       makeApiCall();
       $httpBackend.verifyNoOutstandingExpectation();
     });

     it('should return the response body when 201', function() {
       $httpBackend.when('POST', '/api/people').respond(201, { name: 'john' });

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onSuccess).toHaveBeenCalledWith({ name: 'john' });
     });

     it('should throw the ValidationError when 400', function() {
       $httpBackend.when('POST', '/api/people').respond(400, { name: 'bad' });

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.ValidationError({
         name: 'bad'
       }));
     });

     it('should throw the ConnectivityError when 0', function() {
       $httpBackend.when('POST', '/api/people').respond(0);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.ConnectivityError());
     });

     it('should throw the UnexpectedError when 418', function() {
       $httpBackend.when('POST', '/api/people').respond(418);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.UnexpectedError());
     });
   });

   describe('deletePerson', function() {
     function makeApiCall() {
       apiService.deletePerson(123).then(onSuccess, onError);
     };

     it('should do the DELETE /api/people/123', function() {
       $httpBackend.expect('DELETE', '/api/people/123').respond(0);
       makeApiCall();
       $httpBackend.verifyNoOutstandingExpectation();
     });

     it('should return the response body when 200', function() {
       $httpBackend.expect('DELETE', '/api/people/123').respond(200);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onSuccess).toHaveBeenCalled();
     });

     it('should throw the NotFoundError when 404', function() {
       $httpBackend.expect('DELETE', '/api/people/123').respond(404);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.NotFoundError());
     });

     it('should throw the ConnectivityError when 0', function() {
       $httpBackend.when('DELETE', '/api/people/123').respond(0);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.ConnectivityError());
     });

     it('should throw the UnexpectedError when 418', function() {
       $httpBackend.when('DELETE', '/api/people/123').respond(418);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.UnexpectedError());
     });
   });

   describe('getPerson()', function() {
     function makeApiCall() {
       apiService.getPerson(123).then(onSuccess, onError);
     };

     it('should do the GET /api/people/123', function() {
       $httpBackend.expect('GET', '/api/people/123').respond(0);
       makeApiCall();
       $httpBackend.verifyNoOutstandingExpectation();
     });

     it('should return the response body when 200', function() {
       $httpBackend.expect('GET', '/api/people/123').respond(200, {
         id: 123,
         name: 'john'
       });

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onSuccess).toHaveBeenCalledWith({
         id: 123,
         name: 'john'
       });
     });

     it('should throw the NotFoundError when 404', function() {
       $httpBackend.expect('GET', '/api/people/123').respond(404);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.NotFoundError());
     });

     it('should throw the ConnectivityError when 0', function() {
       $httpBackend.when('GET', '/api/people/123').respond(0);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.ConnectivityError());
     });

     it('should throw the UnexpectedError when 418', function() {
       $httpBackend.when('GET', '/api/people/123').respond(418);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.UnexpectedError());
     });
   });

   describe('getPeople()', function() {
     function makeApiCall() {
       apiService.getPeople().then(onSuccess, onError);
     };

     it('should do the GET /api/people', function() {
       $httpBackend.expect('GET', '/api/people').respond(0);
       makeApiCall();
       $httpBackend.verifyNoOutstandingExpectation();
     });

     it('should return the response body when 200', function() {
       $httpBackend.expect('GET', '/api/people').respond(200, [{},{}]);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onSuccess).toHaveBeenCalledWith([{},{}]);
     });

     it('should throw the ConnectivityError when 0', function() {
       $httpBackend.when('GET', '/api/people').respond(0);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.ConnectivityError());
     });

     it('should throw the UnexpectedError when 418', function() {
       $httpBackend.when('GET', '/api/people').respond(418);

       makeApiCall();
       $httpBackend.flush();

       $httpBackend.verifyNoOutstandingRequest();
       expect(onError).toHaveBeenCalledWith(new ApiErrors.UnexpectedError());
     });
   });
});
