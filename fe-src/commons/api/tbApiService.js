angular.module('tbApiService', [
  'tbBuildUrl',
  'tbResponseHandler'
]).provider('apiService', function() {
  var apiRootUrl;

  this.apiRoot = function(apiRoot) {
    apiRootUrl = apiRoot;
  };

  this.$get = ['buildUrl', '$http', '$q', 'handleResponse', 'ApiErrors', function(buildUrl, $http, $q, handle, ApiErrors) {
    if(!apiRootUrl) {
      throw new Error('apiRoot is not set');
    }

    function ApiService() {
    };

    ApiService.prototype.createPerson = function(person) {
      return handle($http.post(url('people'), person)).likeThis({
        0: throwConnectivityError(),
        201: returnData(),
        400: throwValidationError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.getPerson = function(id) {
      return handle($http.get(url('people/{id}', { id: id }))).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        404: throwNotFoundError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.updatePerson = function(person) {
      return handle($http.put(url('people/{id}', { id: person.id }), person)).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        400: throwValidationError(),
        404: throwNotFoundError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.deletePerson = function(id) {
      return handle($http.delete(url('people/{id}', { id: id }))).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        404: throwNotFoundError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.getPeople = function() {
      return handle($http.get(url('people'))).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        otherwise: throwUnexpectedError()
      });
    };

    return new ApiService();

    function url(resourceTemplateString, resourceValues) {
      return buildUrl(apiRootUrl, resourceTemplateString, resourceValues);
    };

    function returnData() {
      return function(httpResponse) {
        return httpResponse.data;
      };
    };

    function throwConnectivityError() {
      return function() {
        return $q.reject(new ApiErrors.ConnectivityError());
      };
    };

    function throwValidationError() {
      return function(httpResponse) {
        return $q.reject(new ApiErrors.ValidationError(httpResponse.data));
      };
    };

    function throwNotFoundError() {
      return function() {
        return $q.reject(new ApiErrors.NotFoundError());
      };
    };

    function throwUnexpectedError() {
      return function() {
        return $q.reject(new ApiErrors.UnexpectedError());
      };
    };
  }];
}).value('ApiErrors', {
  ConnectivityError: (function() {
    function ConnectivityError() {
      this.stack = (new Error()).stack;
    }
    ConnectivityError.prototype = new Error();
    ConnectivityError.prototype.constructor = ConnectivityError;
    ConnectivityError.name = 'ConnectivityError';
    return ConnectivityError;
  })(),

  ValidationError: (function() {
    function ValidationError(errorMap) {
      this.stack = (new Error()).stack;
      this.errorMap = errorMap;
    }
    ValidationError.prototype = new Error();
    ValidationError.prototype.constructor = ValidationError;
    ValidationError.name = 'ValidationError';
    return ValidationError;
  })(),

  NotFoundError: (function() {
    function NotFoundError() {
      this.stack = (new Error()).stack;
    }
    NotFoundError.prototype = new Error();
    NotFoundError.prototype.constructor = NotFoundError;
    NotFoundError.name = 'NotFoundError';
    return NotFoundError;
  })(),

  UnexpectedError: (function() {
    function UnexpectedError() {
      this.stack = (new Error()).stack;
    }
    UnexpectedError.prototype = new Error();
    UnexpectedError.prototype.constructor = UnexpectedError;
    UnexpectedError.name = 'UnexpectedError';
    return UnexpectedError;
  })()
});
