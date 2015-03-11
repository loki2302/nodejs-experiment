var enableDestroy = require('server-destroy');
var makeModels = require("../be-src/models.js");
var makeApp = require("../be-src/app.js");

describe('app', function() {
  var server;
  beforeEach(function(done) {
    var models = makeModels();
    models.reset(function(error) {
      if(error) {
        throw new Error("Failed to reset database");
      }

      var app = makeApp(models, {
        // no synth delays for tests
      });
      server = app.listen(3000, function() {
        enableDestroy(server);
        done();
      });
    });
  });

  afterEach(function(done) {
    server.destroy(function() {
      done();
    });
  });

  it('should work #1', function() {
    browser.get('/');
    expect(browser.getTitle()).toEqual('nodejs-app-experiment');
  });

  it('should work #2', function() {
    browser.get('/');
    expect(browser.getTitle()).toEqual('nodejs-app-experiment');
  });
});
