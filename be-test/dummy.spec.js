require('co-mocha');

var expect = require('chai').expect;
var appRunnerFactory = require('../be-src/appRunnerFactory');
var TeambuildrClient = require('./teambuildrClient');

describe('Teambuild API', function() {
  var appRunner;
  var client;
  beforeEach(function* () {
    appRunner = yield appRunnerFactory();
    yield appRunner.start();
    yield appRunner.reset();

    client = new TeambuildrClient('http://localhost:3000/api/');
  });

  afterEach(function* () {
    yield appRunner.stop();
    appRunner = null;
  });

  it('should work /success', function* () {
    var response = yield client.helloSuccess();
    expect(response.body).to.deep.equal({
      message: 'hello there'
    });
    expect(response.statusCode).to.equal(200);
  });

  it('should work /badRequest', function* () {
    try {
      yield client.helloBadRequest();
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(400);
      expect(e.response.body).to.deep.equal({
        message: 'hello there'
      })
    }
  });

  it('should work /internalError', function* () {
    try {
      yield client.helloInternalError();
      expect(true).to.equal(false);
    } catch(e) {
      expect(e.response.statusCode).to.equal(500);
    }
  });
});
