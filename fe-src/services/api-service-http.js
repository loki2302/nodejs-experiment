angular.module('api2.rh', [])
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

angular.module('api2', ['api2.rh'])
.service('apiService2', ['$http', '$q', 'responseHandler', 'errors', function($http, $q, responseHandler, errors) {
  this.createNote = function(note) {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .when(400, throwValidationError())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.post('/api/notes', note));
  };

  this.updateNote = function(note) {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .when(400, throwValidationError())
      .when(404, throwNotFoundError())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.put('/api/notes/' + note.id, note));
  };

  this.deleteNote = function(note) {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .when(404, throwNotFoundError())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.delete('/api/notes/' + note.id, note));
  };

  this.getNotes = function() {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.get('/api/notes'));
  };

  this.createCategory = function(category) {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .when(400, throwValidationError())
      .when(409, throwConflictError())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.post('/api/categories', category));
  };

  this.updateCategory = function(category) {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .when(400, throwValidationError())
      .when(404, throwNotFoundError())
      .when(409, throwConflictError())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.put('/api/categories/' + category.id, category));
  };

  this.deleteCategory = function(category) {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .when(404, throwNotFoundError())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.delete('/api/categories/' + category.id, category));
  };

  this.getCategories = function() {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.get('/api/categories'));
  };

  this.getCategoriesWithNameStartingWith = function(nameStartsWith) {
    // TODO: are there any other cases?
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.get('/api/categories', { 
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
      return $q.reject(new errors.ValidationError());
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
  ValidationError: function ValidationError() {},
  NotFoundError: function NotFoundError() {},
  ConflictError: function ConflictError() {},
  UnexpectedError: function UnexpectedError() {}
});
