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

    function throwUnexpectedError() {
      return function() {
        return $q.reject(new ApiErrors.UnexpectedError());
      };
    };
  }];
}).value('ApiErrors', {
  ConnectivityError: function ConnectivityError() {},
  ValidationError: function ValidationError(errorMap) {
    this.errorMap = errorMap;
  },
  UnexpectedError: function UnexpectedError() {}
});
