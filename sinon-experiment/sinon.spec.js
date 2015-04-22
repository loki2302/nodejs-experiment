var expect = require('chai').expect;
var sinon = require('sinon');

describe('sinon', function() {
  it('should work', function() {
    var func = sinon.spy();
    func();
    expect(func.calledOnce).to.equal(true);
  });
});
