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

    // TODO: somehow extract it from here
    return new function() {
      this.createNote = function(note) {
        var uri = buildUri(apiRootUri, 'notes');
        return handle($http.post(uri, note)).likeThis({
          0: throwConnectivityError(),
          201: returnData(),
          400: throwValidationError(),
          otherwise: throwUnexpectedError()
        });
      };

      this.updateNote = function(note) {
        var uri = buildUri(apiRootUri, 'notes/{id}', { id: note.id });
        return handle($http.post(uri, note)).likeThis({
          0: throwConnectivityError(),
          200: returnData(),
          400: throwValidationError(),
          404: throwNotFoundError(),
          otherwise: throwUnexpectedError()
        });
      };

      this.deleteNote = function(note) {
        var uri = buildUri(apiRootUri, 'notes/{id}', { id: note.id });
        return handle($http.delete(uri, note)).likeThis({
          0: throwConnectivityError(),
          200: returnData(),
          404: throwNotFoundError(),
          otherwise: throwUnexpectedError()
        });
      };

      this.getNotes = function() {
        var uri = buildUri(apiRootUri, 'notes');
        return handle($http.get(uri)).likeThis({
          0: throwConnectivityError(),
          200: returnData(),
          otherwise: throwUnexpectedError()
        });
      };

      this.createCategory = function(category) {
        var uri = buildUri(apiRootUri, 'categories');
        return handle($http.post(uri, category)).likeThis({
          0: throwConnectivityError(),
          201: returnData(),
          400: throwValidationError(),
          otherwise: throwUnexpectedError()
        });
      };

      this.updateCategory = function(category) {
        var uri = buildUri(apiRootUri, 'categories/{id}', { id: category.id });
        return handle($http.post(uri, category)).likeThis({
          0: throwConnectivityError(),
          200: returnData(),
          400: throwValidationError(),
          404: throwNotFoundError(),
          otherwise: throwUnexpectedError()
        });
      };

      this.deleteCategory = function(category) {
        var uri = buildUri(apiRootUri, 'categories/{id}', { id: category.id });
        return handle($http.delete(uri, category)).likeThis({
          0: throwConnectivityError(),
          200: returnData(),
          404: throwNotFoundError(),
          otherwise: throwUnexpectedError()
        });
      };

      this.getCategories = function() {
        var uri = buildUri(apiRootUri, 'categories');
        return handle($http.get(uri)).likeThis({
          0: throwConnectivityError(),
          200: returnData(),
          otherwise: throwUnexpectedError()
        });
      };

      this.getCategoriesWithNameStartingWith = function(nameStartsWith) {
        var uri = buildUri(apiRootUri, 'categories');
        return handle($http.get(uri, { 
          params: { nameStartsWith: nameStartsWith } 
        })).likeThis({
          0: throwConnectivityError(),
          200: returnData(),
          otherwise: throwUnexpectedError()
        });
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
    };
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
