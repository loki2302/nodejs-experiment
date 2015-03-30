function AppRunner(app, sequelize, Q, serverDestroy) {
  this.isRunning = false;
  this.app = app;
  this.sequelize = sequelize;
  this.serverDestroy = serverDestroy;
  this.Q = Q;
  this.server = null;
};

AppRunner.prototype.start = function() {
  if(this.isRunning) {
    return this.Q.reject(new Error('The application is already running'));
  }

  var self = this;
  return this.sequelize.sync().then(function() {
    return self.Q.Promise(function(resolve) {
      self.server = self.app.listen(3000, function() {
        self.serverDestroy(self.server);
        console.log('Listening at %j', self.server.address());
        self.isRunning = true;
        resolve();
      });
    });
  }, function(error) {
    return this.Q.reject(new Error('Failed to initialize the database'));
  });
};

AppRunner.prototype.stop = function() {
  if(!this.isRunning) {
    return this.Q.reject(new Error('The application is not running'));
  };

  var self = this;
  return this.Q.Promise(function(resolve) {
    self.server.destroy(function() {
      self.server = null;
      self.isRunning = false;
      resolve();
    });
  });
};

AppRunner.prototype.reset = function() {
  if(!this.isRunning) {
    return this.Q.reject(new Error('The application is not running'));
  };

  var self = this;
  return this.sequelize.drop().then(function() {
    return self.sequelize.sync();
  });
};

module.exports = function(app, sequelize, Q, serverDestroy) {
  return new AppRunner(app, sequelize, Q, serverDestroy);
};
