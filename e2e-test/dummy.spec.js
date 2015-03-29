var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var AppRunner = require('../be-src/appRunner');

describe('Dummy', function() {
  var appRunner;
  beforeEach(function(done) {
    appRunner = new AppRunner();
    appRunner.start().finally(done);
  });

  afterEach(function(done) {
    appRunner.stop().finally(done);
    appRunner = undefined;
  });

  it('should work', function() {
    browser.get('/');
    var h1Element = element(by.css('h1'));
    expect(h1Element.isPresent()).to.eventually.equal(true);
    expect(h1Element.getText()).to.eventually.equal('hello AppController');
  });
});
