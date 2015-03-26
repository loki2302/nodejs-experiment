angular.module('api.responseHandler', [])
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
