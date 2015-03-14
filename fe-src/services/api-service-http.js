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
    var interpretResponse = responseHandler.make()
      .when(0, throwConnectivityError())
      .when(200, returnData())
      .when(400, throwValidationError())
      .otherwise(throwUnexpectedError())
      .wrap;

    return interpretResponse($http.post('/api/notes', note));
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

  function throwUnexpectedError() {
    return function(httpResponse) {
      return $q.reject(new errors.UnexpectedError());
    };
  };  
}])
.value('errors', {
  ConnectivityError: function ConnectivityError() {},
  ValidationError: function ValidationError() {},
  UnexpectedError: function UnexpectedError() {}
});
