angular.module('URIjs', [])
.factory('URI', function() {
  if(!URI) {
    throw new Error('URI is not defined. Did you add URI.js?');
  }

  return URI;
})
.factory('URITemplate', function() {
  if(!URITemplate) {
    throw new Error('URITemplate is not defined. Did you add URITemplate.js?');
  }

  return URITemplate;
});

angular.module('api.rh', [])
.service('responseHandler', [function() {
  this.make = function() {
    return new ResponseHandler();
  };

  function ResponseHandler() {
    var self = this;
    self.handlers = {};
    self.otherwiseHandlerFunc = null;

    self.when = function(statusCode, handlerFunc) {
      self.handlers[statusCode] = handlerFunc;
      return self;
    };

    self.otherwise = function(handlerFunc) {
      self.otherwiseHandlerFunc = handlerFunc;
      return self;
    };

    self.handle = function(httpResponse) {
      var statusCode = httpResponse.status;        
      var handlerFunc = self.handlers[statusCode];
      if(!handlerFunc) {
        handlerFunc = self.otherwiseHandlerFunc;
      }

      return handlerFunc(httpResponse);
    };

    self.wrap = function(promise) {
      return promise.then(self.handle, self.handle);
    };
  };
}]);

angular.module('api', ['api.rh', 'URIjs'])
.factory('buildUri', ['URI', 'URITemplate', function(URI, URITemplate) {
  return function(apiRootUriString, resourceTemplateString, resourceValues) {
    var apiRootUri = new URI(apiRootUriString);
    var resourceTemplate = new URITemplate(resourceTemplateString);
    var resourceUri = new URI(resourceTemplate.expand(resourceValues));
    var uri = resourceUri.absoluteTo(apiRootUri);
    return uri.toString();
  };
}])
.service('apiService', ['$http', '$q', 'responseHandler', 'errors', 'buildUri', 
  function($http, $q, responseHandler, errors, buildUri) {
    var apiRootUri = '/api/';

    this.createNote = function(note) {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(201, returnData())
        .when(400, throwValidationError())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'notes');
      return interpretResponse($http.post(uri, note));
    };

    this.updateNote = function(note) {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(200, returnData())
        .when(400, throwValidationError())
        .when(404, throwNotFoundError())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'notes/{id}', { id: note.id });
      return interpretResponse($http.post(uri, note));
    };

    this.deleteNote = function(note) {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(200, returnData())
        .when(404, throwNotFoundError())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'notes/{id}', { id: note.id });
      return interpretResponse($http.delete(uri, note));
    };

    this.getNotes = function() {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(200, returnData())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'notes');
      return interpretResponse($http.get(uri));
    };

    this.createCategory = function(category) {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(201, returnData())
        .when(400, throwValidationError())
        .when(409, throwConflictError())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'categories');
      return interpretResponse($http.post(uri, category));
    };

    this.updateCategory = function(category) {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(200, returnData())
        .when(400, throwValidationError())
        .when(404, throwNotFoundError())
        .when(409, throwConflictError())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'categories/{id}', { id: category.id });
      return interpretResponse($http.post(uri, category));
    };

    this.deleteCategory = function(category) {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(200, returnData())
        .when(404, throwNotFoundError())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'categories/{id}', { id: category.id });
      return interpretResponse($http.delete(uri, category));
    };

    this.getCategories = function() {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(200, returnData())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'categories');
      return interpretResponse($http.get(uri));
    };

    this.getCategoriesWithNameStartingWith = function(nameStartsWith) {
      var interpretResponse = responseHandler.make()
        .when(0, throwConnectivityError())
        .when(200, returnData())
        .otherwise(throwUnexpectedError())
        .wrap;

      var uri = buildUri(apiRootUri, 'categories');
      return interpretResponse($http.get(uri, { 
        params: { nameStartsWith: nameStartsWith } 
      }));
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

    function throwConflictError() {
      return function(httpResponse) {
        return $q.reject(new errors.ConflictError());
      };
    };

    function throwUnexpectedError() {
      return function(httpResponse) {
        return $q.reject(new errors.UnexpectedError());
      };
    };  
}])
.value('errors', {
  ConnectivityError: function ConnectivityError() {},
  ValidationError: function ValidationError(errorMap) {
    this.errorMap = errorMap;
  },
  NotFoundError: function NotFoundError() {},
  ConflictError: function ConflictError() {},
  UnexpectedError: function UnexpectedError() {}
});
