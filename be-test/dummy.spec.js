require('co-mocha');

var expect = require('chai').expect;
var AppRunner = require('../be-src/appRunner');
var TeambuildrClient = require('./teambuildrClient');

describe('Teambuild API', function() {
  var appRunner;
  var client;
  beforeEach(function* () {
    appRunner = new AppRunner();
    yield appRunner.start();

    client = new TeambuildrClient('http://localhost:3000/api/');
  });

  afterEach(function* () {
    yield appRunner.stop();
    appRunner = undefined;
  });

  it('should work', function* () {
    var helloResponse = yield client.hello();
    expect(helloResponse.body).to.deep.equal({
      message: 'hello there'
    });
    expect(helloResponse.statusCode).to.equal(200);
  });
});
