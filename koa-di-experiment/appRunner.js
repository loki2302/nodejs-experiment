module.exports = function(app, sequelize, Q, serverDestroy) {
  var isRunning = false;
  var server = null;

  return {
    start: function() {
      if(isRunning) {
        return Q.reject(new Error('The application is already running'));
      }

      return sequelize.sync().then(function() {
        return Q.Promise(function(resolve) {
          server = app.listen(3000, function() {
            serverDestroy(server);
            console.log('Listening at %j', server.address());
            isRunning = true;
            resolve();
          });
        });
      }, function(error) {
        return Q.reject(new Error('Failed to initialize the database'));
      });
    },

    stop: function() {
      if(!isRunning) {
        return Q.reject(new Error('The application is not running'));
      };

      return Q.Promise(function(resolve) {
        server.destroy(function() {
          server = null;
          isRunning = false;
          resolve();
        });
      });
    },

    reset: function() {
      if(!isRunning) {
        return Q.reject(new Error('The application is not running'));
      };

      return sequelize.drop().then(function() {
        return sequelize.sync();
      });
    }
  };
};
