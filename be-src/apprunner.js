var makeApp = require('./app');
var makeModels = require('./models');
var Q = require('q');
var enableDestroy = require('server-destroy');

module.exports = function() {
  var isRunning = false;
  var server;
  var models;

  this.start = function(config) {
    if(isRunning) {
      return Q.reject(new Error('Already running'));
    }

    models = makeModels();
    return models.initialize().then(function() {
      var app = makeApp(models, config);

      return Q.Promise(function(resolve, reject) {
        server = app.listen((process.env.PORT || 3000), function() {
          enableDestroy(server);
          console.log('Listening at %j', server.address());
          isRunning = true;
          resolve();
        }); // TODO: when do I reject?
      });
    }, function(error) {
      return Q.reject(new Error('Failed to initialize models'));
    });    
  };

  this.stop = function() {
    if(!isRunning) {
      return Q.reject(new Error('Not running'));
    }

    return Q.Promise(function(resolve, reject) {
      server.destroy(function() {
        server = undefined;
        models = undefined;
        isRunning = false;
        resolve();
      });
    });
  };

  this.reset = function() {
    if(!isRunning) {
      return Q.reject(new Error('Not running'));
    }

    return models.reset();
  };
};
