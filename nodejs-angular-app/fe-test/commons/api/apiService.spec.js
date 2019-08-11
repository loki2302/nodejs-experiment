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

   describe('People API', function() {
     describe('createPerson()', function() {
       function makeApiCall() {
         apiService.createPerson({
           name: 'john'
         }).then(onSuccess, onError);
       };

       it('should do the POST /api/people', function() {
         $httpBackend.expect('POST', '/api/people', { name: 'john' }).respond(0);
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

         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ValidationError));
         expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
           errorMap: { name: 'bad' }
         }));
       });

       it('should throw the ConnectivityError when 0', function() {
         $httpBackend.when('POST', '/api/people').respond(0);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
       });

       it('should throw the UnexpectedError when 418', function() {
         $httpBackend.when('POST', '/api/people').respond(418);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
       });
     });

     describe('updatePerson', function() {
       function makeApiCall() {
         apiService.updatePerson({
           id: 123,
           name: 'john'
         }).then(onSuccess, onError);
       };

       it('should do the PUT /api/people/123', function() {
         $httpBackend.expect('PUT', '/api/people/123', {
           id: 123,
           name: 'john'
         }).respond(0);
         makeApiCall();
         $httpBackend.verifyNoOutstandingExpectation();
       });

       it('should return the response body when 200', function() {
         $httpBackend.when('PUT', '/api/people/123').respond(200, {
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

       it('should throw the ValidationError when 400', function() {
         $httpBackend.when('PUT', '/api/people/123').respond(400, { name: 'bad' });

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();

         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ValidationError));
         expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
           errorMap: { name: 'bad' }
         }));
       });

       it('should throw the ConnectivityError when 0', function() {
         $httpBackend.when('PUT', '/api/people/123').respond(0);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
       });

       it('should throw the UnexpectedError when 418', function() {
         $httpBackend.when('PUT', '/api/people/123').respond(418);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
       });
     });

     describe('deletePerson()', function() {
       function makeApiCall() {
         apiService.deletePerson(123).then(onSuccess, onError);
       };

       it('should do the DELETE /api/people/123', function() {
         $httpBackend.expect('DELETE', '/api/people/123').respond(0);
         makeApiCall();
         $httpBackend.verifyNoOutstandingExpectation();
       });

       it('should return the response body when 200', function() {
         $httpBackend.when('DELETE', '/api/people/123').respond(200);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onSuccess).toHaveBeenCalled();
       });

       it('should throw the NotFoundError when 404', function() {
         $httpBackend.when('DELETE', '/api/people/123').respond(404);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.NotFoundError));
       });

       it('should throw the ConnectivityError when 0', function() {
         $httpBackend.when('DELETE', '/api/people/123').respond(0);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
       });

       it('should throw the UnexpectedError when 418', function() {
         $httpBackend.when('DELETE', '/api/people/123').respond(418);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
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
         $httpBackend.when('GET', '/api/people/123').respond(200, {
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
         $httpBackend.when('GET', '/api/people/123').respond(404);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.NotFoundError));
       });

       it('should throw the ConnectivityError when 0', function() {
         $httpBackend.when('GET', '/api/people/123').respond(0);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
       });

       it('should throw the UnexpectedError when 418', function() {
         $httpBackend.when('GET', '/api/people/123').respond(418);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
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
         $httpBackend.when('GET', '/api/people').respond(200, [{},{}]);

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
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
       });

       it('should throw the UnexpectedError when 418', function() {
         $httpBackend.when('GET', '/api/people').respond(418);

         makeApiCall();
         $httpBackend.flush();

         $httpBackend.verifyNoOutstandingRequest();
         expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
      });
    });
  });

  describe('Teams API', function() {
    describe('createTeam()', function() {
      function makeApiCall() {
        apiService.createTeam({
          name: 'the team'
        }).then(onSuccess, onError);
      };

      it('should do the POST /api/teams', function() {
        $httpBackend.expect('POST', '/api/teams', { name: 'the team' }).respond(0);
        makeApiCall();
        $httpBackend.verifyNoOutstandingExpectation();
      });

      it('should return the response body when 201', function() {
        $httpBackend.when('POST', '/api/teams').respond(201, { name: 'the team' });

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onSuccess).toHaveBeenCalledWith({ name: 'the team' });
      });

      it('should throw the ValidationError when 400', function() {
        $httpBackend.when('POST', '/api/teams').respond(400, { name: 'bad' });

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();

        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ValidationError));
        expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
          errorMap: { name: 'bad' }
        }));
      });

      it('should throw the ConnectivityError when 0', function() {
        $httpBackend.when('POST', '/api/teams').respond(0);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
      });

      it('should throw the UnexpectedError when 418', function() {
        $httpBackend.when('POST', '/api/teams').respond(418);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
      });
    });

    describe('updateTeam', function() {
      function makeApiCall() {
        apiService.updateTeam({
          id: 123,
          name: 'the team'
        }).then(onSuccess, onError);
      };

      it('should do the PUT /api/teams/123', function() {
        $httpBackend.expect('PUT', '/api/teams/123', {
          id: 123,
          name: 'the team'
        }).respond(0);
        makeApiCall();
        $httpBackend.verifyNoOutstandingExpectation();
      });

      it('should return the response body when 200', function() {
        $httpBackend.when('PUT', '/api/teams/123').respond(200, {
          id: 123,
          name: 'the team'
        });

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onSuccess).toHaveBeenCalledWith({
          id: 123,
          name: 'the team'
        });
      });

      it('should throw the ValidationError when 400', function() {
        $httpBackend.when('PUT', '/api/teams/123').respond(400, { name: 'bad' });

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();

        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ValidationError));
        expect(onError).toHaveBeenCalledWith(jasmine.objectContaining({
          errorMap: { name: 'bad' }
        }));
      });

      it('should throw the ConnectivityError when 0', function() {
        $httpBackend.when('PUT', '/api/teams/123').respond(0);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
      });

      it('should throw the UnexpectedError when 418', function() {
        $httpBackend.when('PUT', '/api/teams/123').respond(418);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
      });
    });

    describe('deleteTeam()', function() {
      function makeApiCall() {
        apiService.deleteTeam(123).then(onSuccess, onError);
      };

      it('should do the DELETE /api/teams/123', function() {
        $httpBackend.expect('DELETE', '/api/teams/123').respond(0);
        makeApiCall();
        $httpBackend.verifyNoOutstandingExpectation();
      });

      it('should return the response body when 200', function() {
        $httpBackend.when('DELETE', '/api/teams/123').respond(200);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onSuccess).toHaveBeenCalled();
      });

      it('should throw the NotFoundError when 404', function() {
        $httpBackend.when('DELETE', '/api/teams/123').respond(404);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.NotFoundError));
      });

      it('should throw the ConnectivityError when 0', function() {
        $httpBackend.when('DELETE', '/api/teams/123').respond(0);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
      });

      it('should throw the UnexpectedError when 418', function() {
        $httpBackend.when('DELETE', '/api/teams/123').respond(418);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
      });
    });

    describe('getTeam()', function() {
      function makeApiCall() {
        apiService.getTeam(123).then(onSuccess, onError);
      };

      it('should do the GET /api/teams/123', function() {
        $httpBackend.expect('GET', '/api/teams/123').respond(0);
        makeApiCall();
        $httpBackend.verifyNoOutstandingExpectation();
      });

      it('should return the response body when 200', function() {
        $httpBackend.when('GET', '/api/teams/123').respond(200, {
          id: 123,
          name: 'the team'
        });

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onSuccess).toHaveBeenCalledWith({
          id: 123,
          name: 'the team'
        });
      });

      it('should throw the NotFoundError when 404', function() {
        $httpBackend.when('GET', '/api/teams/123').respond(404);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.NotFoundError));
      });

      it('should throw the ConnectivityError when 0', function() {
        $httpBackend.when('GET', '/api/teams/123').respond(0);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
      });

      it('should throw the UnexpectedError when 418', function() {
        $httpBackend.when('GET', '/api/teams/123').respond(418);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
      });
    });

    describe('getTeams()', function() {
      function makeApiCall() {
        apiService.getTeams().then(onSuccess, onError);
      };

      it('should do the GET /api/teams', function() {
        $httpBackend.expect('GET', '/api/teams').respond(0);
        makeApiCall();
        $httpBackend.verifyNoOutstandingExpectation();
      });

      it('should return the response body when 200', function() {
        $httpBackend.when('GET', '/api/teams').respond(200, [{},{}]);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onSuccess).toHaveBeenCalledWith([{},{}]);
      });

      it('should throw the ConnectivityError when 0', function() {
        $httpBackend.when('GET', '/api/teams').respond(0);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
      });

      it('should throw the UnexpectedError when 418', function() {
        $httpBackend.when('GET', '/api/teams').respond(418);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
      });
    });
  });

  describe('Utils API', function() {
    describe('getRandomAvatar()', function() {
      function makeApiCall() {
        apiService.getRandomAvatar().then(onSuccess, onError);
      };

      it('should do the GET /api/utils/randomAvatar', function() {
        $httpBackend.expect('GET', '/api/utils/randomAvatar').respond(0);
        makeApiCall();
        $httpBackend.verifyNoOutstandingExpectation();
      });

      it('should return the response body when 200', function() {
        $httpBackend.when('GET', '/api/utils/randomAvatar').respond(200, {});

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onSuccess).toHaveBeenCalledWith({});
      });

      it('should throw the ConnectivityError when 0', function() {
        $httpBackend.when('GET', '/api/utils/randomAvatar').respond(0);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
      });

      it('should throw the UnexpectedError when 418', function() {
        $httpBackend.when('GET', '/api/utils/randomAvatar').respond(418);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
      });
    });

    describe('getStats()', function() {
      function makeApiCall() {
        apiService.getStats().then(onSuccess, onError);
      };

      it('should do the GET /api/utils/stats', function() {
        $httpBackend.expect('GET', '/api/utils/stats').respond(0);
        makeApiCall();
        $httpBackend.verifyNoOutstandingExpectation();
      });

      it('should return the response body when 200', function() {
        $httpBackend.when('GET', '/api/utils/stats').respond(200, {});

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onSuccess).toHaveBeenCalledWith({});
      });

      it('should throw the ConnectivityError when 0', function() {
        $httpBackend.when('GET', '/api/utils/stats').respond(0);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.ConnectivityError));
      });

      it('should throw the UnexpectedError when 418', function() {
        $httpBackend.when('GET', '/api/utils/stats').respond(418);

        makeApiCall();
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
        expect(onError).toHaveBeenCalledWith(jasmine.any(ApiErrors.UnexpectedError));
      });
    });
  });
});
