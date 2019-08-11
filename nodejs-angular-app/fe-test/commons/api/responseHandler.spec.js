describe('tbResponseHandler', function() {
  beforeEach(module('tbResponseHandler'));

  var handle;
  var $q;
  var $rootScope;
  beforeEach(inject(function(_handleResponse_, _$q_, _$rootScope_) {
    handle = _handleResponse_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  describe('the typical use case', function() {
    var responseDeferred;
    var result;
    beforeEach(function() {
      responseDeferred = $q.defer();

      status200Handler = jasmine.createSpy('status200Handler');
      status500Handler = jasmine.createSpy('status400Handler');
      otherwiseHandler = jasmine.createSpy('otherwiseHandler');

      handle(responseDeferred.promise).likeThis({
        200: function(response) {
          return 'good: ' + response.data.message
        },
        400: function(response) {
          return 'bad: ' + response.data.message
        },
        otherwise: function(response) {
          return 'default(' + response.status + '): ' + response.data.message
        }
      }).then(function(r) {
        result = r;
      });
    });

    it('should give me good result when status is 200', function() {
      $rootScope.$apply(function() {
        responseDeferred.resolve({
          status: 200,
          data: { message: 'hello' }
        });
      });

      expect(result).toBe('good: hello');
    });

    it('should give me good result when status is 200', function() {
      $rootScope.$apply(function() {
        responseDeferred.resolve({
          status: 400,
          data: { message: 'hello' }
        });
      });

      expect(result).toBe('bad: hello');
    });

    it('should give me default result when status is non-200 and non-400', function() {
      $rootScope.$apply(function() {
        responseDeferred.resolve({
          status: 500,
          data: { message: 'hello' }
        });
      });

      expect(result).toBe('default(500): hello');
    });
  });

  describe('when there is a matching handler', function() {
    var responseDeferred;
    var status200Handler;
    var status500Handler;
    beforeEach(function() {
      responseDeferred = $q.defer();
      status200Handler = jasmine.createSpy('status200Handler');
      status500Handler = jasmine.createSpy('status500Handler');

      handle(responseDeferred.promise).likeThis({
        200: status200Handler,
        500: status500Handler
      });
    });

    it('should delegate to this handler, when promise is resolved', function() {
      var httpResponse = {
        status: 200,
        data: { message: 'hello' }
      };

      $rootScope.$apply(function() {
        responseDeferred.resolve(httpResponse);
      });

      expect(status200Handler).toHaveBeenCalledWith(httpResponse);
      expect(status500Handler).not.toHaveBeenCalled();
    });

    it('should delegate to this handler, when promise is rejected', function() {
      var httpResponse = {
        status: 500,
        data: { message: 'hello' }
      };

      $rootScope.$apply(function() {
        responseDeferred.reject(httpResponse);
      });

      expect(status200Handler).not.toHaveBeenCalled();
      expect(status500Handler).toHaveBeenCalledWith(httpResponse);
    });
  });

  describe('when there is no matching handler', function() {
    it('should throw if the "otherwise" handler is not set', function() {
      var responseDeferred = $q.defer();
      handle(responseDeferred.promise).likeThis({});

      var httpResponse = {
        status: 200,
        data: { message: 'hello' }
      };

      expect(function() {
        $rootScope.$apply(function() {
          responseDeferred.resolve(httpResponse);
        });
      }).toThrowError(Error, /200/);
    });

    it('should delegate to the "otherwise" handler if it is set', function() {
      var otherwiseHandler = jasmine.createSpy('otherwiseHandler');

      var responseDeferred = $q.defer();
      handle(responseDeferred.promise).likeThis({
        otherwise: otherwiseHandler
      });

      var httpResponse = {
        status: 200,
        data: { message: 'hello' }
      };

      $rootScope.$apply(function() {
        responseDeferred.resolve(httpResponse);
      });

      expect(otherwiseHandler).toHaveBeenCalledWith(httpResponse);
    });
  });
});
