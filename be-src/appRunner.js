var Q = require('q');
var makeApp = require('./appMiddleware');
var enableDestroy = require('server-destroy');

module.exports = function() {

  var isRunning = false;
  var server;

  this.start = function() {
    if(isRunning) {
      return Q.reject(new Error('The application is already running'));
    }

    var app = makeApp();

    return Q.Promise(function(resolve, reject) {
      server = app.listen(3000, function() {
        enableDestroy(server);
        console.log('The application is listening at %j', server.address());
        isRunning = true;
        resolve();
      });
    });
  };

  this.stop = function() {
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
  };

};
