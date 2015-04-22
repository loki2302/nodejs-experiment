var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var expect = chai.expect;

describe('sinon', function() {
  it('should work', function() {
    var func = sinon.spy();
    func();
    expect(func.calledOnce).to.equal(true);
  });
});

describe('sinon-chai', function() {
  it('should make things more straightforward', function() {
    var func = sinon.spy();
    func();
    expect(func).to.have.been.calledOnce;
  });
});
