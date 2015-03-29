var async = require('./convertES6GeneratorFuncToFuncWithCallback');
var AppRunner = require('../be-src/appRunner');
var TeambuildrClient = require('./teambuildrClient');

describe('Teambuildr API', function() {
  var appRunner;
  var client;
  beforeEach(async(function* () {
    appRunner = new AppRunner();
    yield appRunner.start();

    client = new TeambuildrClient('http://localhost:3000/api/');
  }));

  afterEach(async(function* () {
    yield appRunner.stop();
    appRunner = undefined;
  }));

  it('should work', async(function* () {
    var helloResponse = yield client.hello();
    expect(helloResponse.body).toEqual({
      message: 'hello there'
    });
    expect(helloResponse.statusCode).toBe(200);
  }));
});
