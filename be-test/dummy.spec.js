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

  it('should work', function* () {
    var helloResponse = yield client.hello();
    expect(helloResponse.body).to.deep.equal({
      message: 'hello there'
    });
    expect(helloResponse.statusCode).to.equal(200);
  });
});
