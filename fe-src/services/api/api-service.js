angular.module('api', [
  'api.responseHandler',
  'api.buildUri'
])
.provider('apiService', function() {
  var apiRootUri;

  this.apiRoot = function(apiRoot) {
    apiRootUri = apiRoot;
  };

  this.$get = ['$http', '$q', 'handle', 'errors', 'buildUri', function($http, $q, handle, errors, buildUri) {
    if(!apiRootUri) {
      throw new Error('apiRoot is not set');
    }    

    function ApiService() {};

    ApiService.prototype.createNote = function(note) {
      return handle($http.post(uri('notes'), note)).likeThis({
        0: throwConnectivityError(),
        201: returnData(),
        400: throwValidationError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.updateNote = function(note) {
      return handle($http.post(uri('notes/{id}', { id: note.id }), note)).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        400: throwValidationError(),
        404: throwNotFoundError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.deleteNote = function(note) {
      return handle($http.delete(uri('notes/{id}', { id: note.id }), note)).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        404: throwNotFoundError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.getNotes = function() {
      return handle($http.get(uri('notes'))).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.createCategory = function(category) {
      return handle($http.post(uri('categories'), category)).likeThis({
        0: throwConnectivityError(),
        201: returnData(),
        400: throwValidationError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.updateCategory = function(category) {
      return handle($http.post(uri('categories/{id}', { id: category.id }), category)).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        400: throwValidationError(),
        404: throwNotFoundError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.deleteCategory = function(category) {
      return handle($http.delete(uri('categories/{id}', { id: category.id }), category)).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        404: throwNotFoundError(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.getCategories = function() {
      return handle($http.get(uri('categories'))).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        otherwise: throwUnexpectedError()
      });
    };

    ApiService.prototype.getCategoriesWithNameStartingWith = function(nameStartsWith) {
      return handle($http.get(uri('categories'), { 
        params: { nameStartsWith: nameStartsWith } 
      })).likeThis({
        0: throwConnectivityError(),
        200: returnData(),
        otherwise: throwUnexpectedError()
      });
    };

    var uri = function(resourceTemplateString, resourceValues) {
      return buildUri(apiRootUri, resourceTemplateString, resourceValues);
    };

    function throwConnectivityError() {
      return function(httpResponse) {
        return $q.reject(new errors.ConnectivityError());
      };
    };

    function returnData() {
      return function(httpResponse) {
        return httpResponse.data;
      };
    };

    function throwValidationError() {
      return function(httpResponse) {
        return $q.reject(new errors.ValidationError(httpResponse.data));
      };
    };

    function throwNotFoundError() {
      return function(httpResponse) {
        return $q.reject(new errors.NotFoundError());
      };
    };

    function throwUnexpectedError() {
      return function(httpResponse) {
        return $q.reject(new errors.UnexpectedError());
      };
    };

    return new ApiService();
  }];
})
.value('errors', {
  ConnectivityError: function ConnectivityError() {},
  ValidationError: function ValidationError(errorMap) {
    this.errorMap = errorMap;
  },
  NotFoundError: function NotFoundError() {},
  UnexpectedError: function UnexpectedError() {}
});
