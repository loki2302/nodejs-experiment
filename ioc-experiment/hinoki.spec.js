var expect = require('chai').expect;
var hinoki = require('hinoki');
var Q = require('q');

describe('hinoki', function() {
  it('should let me register and resolve a value', function(done) {
    var container = {
      values: {
        a: 123
      }
    };

    hinoki.get(container, 'a').then(function(a) {
      expect(a).to.equal(123);
      done();
    });
  });

  it('should fail when the value is impossible to resolve', function(done) {
    var container = {
      values: {
        // empty
      }
    };

    hinoki.get(container, 'a').then(null, function(error) {
      expect(error).to.be.instanceof(hinoki.UnresolvableError);
      expect(error.path[0]).to.equal('a');
      done();
    });
  });

  it('should let me register a factory', function(done) {
    var container = {
      factories: {
        a: function() {
          return 123;
        }
      }
    };

    hinoki.get(container, 'a').then(function(a) {
      expect(a).to.equal(123);
      expect(container.values.a).to.equal(123);
      done();
    });
  });

  it('should fail when the factory throws', function(done) {
    var container = {
      factories: {
        a: function() {
          throw new Error('everything is bad');
        }
      }
    };

    hinoki.get(container, 'a').then(null, function(error) {
      expect(error).to.be.instanceof(hinoki.ThrowInFactoryError);
      expect(error.path[0]).to.equal('a');
      expect(error.error).to.be.instanceof(Error);
      expect(error.error.message).to.equal('everything is bad');
      done();
    });
  });

  it('should let me register an async factory', function(done) {
    var container = {
      factories: {
        a: function() {
          var deferred = Q.defer();
          setTimeout(function() {
            deferred.resolve(123);
          }, 10);
          return deferred.promise;
        }
      }
    };

    hinoki.get(container, 'a').then(function(a) {
      expect(a).to.equal(123);
      expect(container.values.a).to.equal(123);
      done();
    });
  });
});
