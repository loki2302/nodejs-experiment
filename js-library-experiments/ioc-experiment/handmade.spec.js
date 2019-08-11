var expect = require('chai').expect;
var Injector = require('./handmade');

describe('handmade', function() {
  it('should let me register and resolve the value', function() {
    var injector = new Injector();
    injector.value('a', 123);
    expect(injector.get('a')).to.equal(123);
  });

  it('should let me register and resolve the ctor function', function() {
    function MyService(a, b) {
      this.a = a;
      this.b = b;
    };

    var injector = new Injector();
    injector.value('a', 2);
    injector.value('b', 3);
    injector.class('myService', MyService);

    var myService = injector.get('myService');
    expect(myService).to.be.instanceof(MyService);
    expect(myService.a).to.equal(2);
    expect(myService.b).to.equal(3);
  });
});
