var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var expect = chai.expect;

describe('sinon', function() {
  describe('spies', function() {
    it('should let me use a dummy spy', function() {
      var func = sinon.spy();
      func(123, 'hello');
      expect(func).to.have.been.calledOnce;
      expect(func).to.have.been.calledWith(123, 'hello');
    });

    it('should let me use a spy for an existing func', function() {
      var func = sinon.spy(function() { return 123; });
      var result = func();
      expect(result).to.equal(123);
      expect(func).to.have.been.calledOnce;
    });

    it('should let me use a spy for an object func', function() {
      var Calculator = function() {
        this.add = function(a, b) { return a + b; };
      };
      var calculator = new Calculator();
      sinon.spy(calculator, 'add');

      var result = calculator.add(2, 3);
      expect(result).to.equal(5);
      expect(calculator.add).to.have.been.calledOnce;
      expect(calculator.add).to.have.been.calledWith(2, 3);
      expect(calculator.add).to.have.been.called;
      expect(calculator.add.callCount).to.equal(1);

      expect(calculator.add.args.length).to.equal(1);
      expect(calculator.add.args[0]).to.deep.equal([2, 3]);

      expect(calculator.add.returnValues.length).to.equal(1);
      expect(calculator.add.returnValues[0]).to.equal(5);
    });
  });

  describe('stub', function() {
    it('should let me use a stub that returns something', function() {
      var func = sinon.stub().returns(123);
      expect(func()).to.equal(123);
    });

    it('should let me use a stub that throws', function() {
      var func = sinon.stub().throws(new Error('very bad'));
      expect(function() {
        func();
      }).to.throw(Error, /very bad/);
    });
  });

  describe('mock', function() {
    it('should let me use mocks', function() {
      var obj = {
        add: function(a, b) { return a + b; }
      };

      var objMock = sinon.mock(obj);
      objMock.expects('add').once().returns(123);

      expect(obj.add(2, 3)).to.equal(123);
      objMock.verify();
    });
  });
});
