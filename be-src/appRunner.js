var Q = require('q');
var makeApp = require('./appMiddleware');
var enableDestroy = require('server-destroy');
var makeModels = require('./models');

module.exports = function() {
  var isRunning = false;
  var server;
  var models;

  this.start = function() {
    if(isRunning) {
      return Q.reject(new Error('The application is already running'));
    }

    models = makeModels();
    var app = makeApp(models);

    return models.initialize().then(function() {
      return Q.Promise(function(resolve, reject) {
        server = app.listen(3000, function(err) {
          if(err) {
            reject(new Error('Failed to listen'));
            return;
          }

          enableDestroy(server);
          console.log('The application is listening at %j', server.address());
          isRunning = true;

          resolve();
        });
      });
    }, function(error) {
      return Q.reject(new Error('Failed to initialize models'));
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

  this.reset = function() {
    if(!isRunning) {
      return Q.reject(new Error('The application is not running'));
    }

    return models.reset();
  };
};
