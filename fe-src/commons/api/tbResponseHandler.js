angular.module('tbResponseHandler', [
]).factory('handleResponse', [function() {
  function ResponseHandler(responsePromise) {
    this.responsePromise = responsePromise;
  };

  ResponseHandler.prototype.likeThis = function(handlerMap) {
    return this.responsePromise.then(handleHttpResponse, handleHttpResponse);

    function handleHttpResponse(httpResponse) {      
      var statusCode = httpResponse.status;
      var handlerFunc = handlerMap[statusCode];
      if(!handlerFunc) {
        handlerFunc = handlerMap.otherwise;
      }

      if(!handlerFunc) {
        throw new Error(
          "There is no handler for status code " + statusCode +
          " and no 'otherwise' handler is defined");
      }

      return handlerFunc(httpResponse);
    };
  };

  return function(responsePromise) {
    return new ResponseHandler(responsePromise);
  };
}]);
