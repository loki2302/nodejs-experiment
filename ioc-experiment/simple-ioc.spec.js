var expect = require('chai').expect;
var ioc = require('simple-ioc');

describe('simple-ioc', function() {
  it('should let me register instances and resolve them by name', function(done) {
    ioc
      .getContainer()
      .registerResolved('someValue', 123)
      .registerResolved('someOtherValue', 'hello there')
      .inject(function(someOtherValue, someValue) {
        expect(someValue).to.equal(123);
        expect(someOtherValue).to.equal('hello there');
        done();
      });
  });

  // TODO: what was the motivation for this feature???
  it('should let me register instance via pub', function(done) {
    ioc
      .getContainer()
      .registerInjectable('a', function(pub) {
        pub.a = 123
      })
      .inject(function(a) {
        expect(a).to.contain({ a: 123 });
        done();
      })
  });

  it('should let me register injectables and resolve them', function(done) {
    ioc
      .getContainer()
      .registerResolved({
        a: 2,
        b: 3
      })
      .registerInjectable({
        sum: function(a, b) {
          return a + b;
        }
      })
      .inject(function(sum) {
        expect(sum).to.equal(5);
        done();
      });
  });

  it('should let me register asynchronous components and resolve them', function(done) {
    ioc
      .getContainer()
      .registerInjectable({
        a: function(callback) {
          setTimeout(function() {
            callback(2);
          }, 10)
        },
        b: function(callback) {
          setTimeout(function() {
            callback(3);
          }, 10)
        },
        sum: function(a, b, callback) {
          setTimeout(function() {
            callback(a + b);
          }, 10);
        }
      })
      .inject(function(a, b, sum) {
        expect(a).to.equal(2);
        expect(b).to.equal(3);
        expect(sum).to.equal(5);
        done();
      });
  });
});
