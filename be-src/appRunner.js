module.exports = function(Q, enableDestroy, app, dataContext, serverPort) {
  var isRunning = false;
  var server;

  return {
    start: function() {
      if(isRunning) {
        return Q.reject(new Error('The application is already running'));
      }

      return dataContext.sync().then(function() {
        return Q.Promise(function(resolve, reject) {
          server = app.listen(serverPort, function() {
            enableDestroy(server);
            console.log('The application is listening at %j', server.address());
            isRunning = true;

            resolve();
          });
        });
      }, function(error) {
        return Q.reject(new Error('Failed to initialize models'));
      });
    },
    stop: function() {
      if(!isRunning) {
        return Q.reject(new Error('The application is not running'));
      }

      return Q.Promise(function(resolve, reject) {
        server.destroy(function() {
          server = undefined;
          isRunning = false;
          resolve();
        });
      });
    },
    reset: function() {
      if(!isRunning) {
        return Q.reject(new Error('The application is not running'));
      }

      return dataContext.drop().then(function() {
        return dataContext.sync();
      });
    }
  }
};
