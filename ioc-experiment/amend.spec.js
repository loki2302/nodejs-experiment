var expect = require('chai').expect;
var Container = require('amend').Container;

describe('amend', function() {
  it('should let me register a singleton via ctor function', function() {
    var instanceCount = 0;
    function MyService() {
      ++instanceCount;
    };

    var container = new Container();
    container.class('myService', MyService);

    var instance1 = container.get('myService');
    expect(instance1).to.be.instanceof(MyService);
    expect(instanceCount).to.equal(1);

    var instance2 = container.get('myService');
    expect(instance2).to.be.instanceof(MyService);
    expect(instanceCount).to.equal(1);
  });

  it('should let me register a value', function() {
    var container = new Container();
    container.value('a', 123);

    var a = container.get('a');
    expect(a).to.equal(123);
  });

  it('should let me register a singleton via factory function', function() {
    var container = new Container();

    var instanceCount = 0;
    container.factory('a', function() {
      return ++instanceCount;
    });

    expect(container.get('a')).to.equal(1);
    expect(container.get('a')).to.equal(1);
  });

  it('should let me inject a value', function() {
    var container = new Container();
    container.value('a', 2);
    container.value('b', 3);
    container.factory('sum', function(a, b) {
      return a + b;
    });

    var sum = container.get('sum');
    expect(sum).to.equal(5);
  });
});
