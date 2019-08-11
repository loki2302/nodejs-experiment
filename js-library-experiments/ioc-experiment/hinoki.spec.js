var expect = require('chai').expect;
var hinoki = require('hinoki');
var Q = require('q');

describe('hinoki', function() {
  it('should let me register and resolve a value', function(done) {
    var lifetime = {
      a: 123
    };

    hinoki(function() {}, lifetime, 'a').then(function(a) {
      expect(a).to.equal(123);
      done();
    });
  });

  it('should fail when the value is impossible to resolve', function(done) {
    var lifetime = {
      /* empty */
    };

    hinoki(function() {}, lifetime, 'a').then(null, function(error) {
      expect(error).to.be.instanceof(hinoki.NotFoundError);
      expect(error.path[0]).to.equal('a');
      done();
    });
  });

  it('should let me register a factory via source', function(done) {
    var mySource = function(key) {
      if(key === 'x') {
        return function() {
          return 11;
        };
      }

      if(key === 'y') {
        return function() {
          return 22;
        };
      }

      if(key === 'z') {
        return function(x, y) {
          return x + y;
        };
      }
    };

    hinoki(mySource, {}, 'z').then(function(z) {
      expect(z).to.equal(33);
      done();
    });
  });

  it('should fail when the source throws', function() {
    expect(function() {
      hinoki(function(key) {
        throw new Error('everything is bad!');
      }, {}, 'x');
    }).to.throw(Error, /everything is bad!/);
  });

  it('should fail when the factory throws', function(done) {
    hinoki(function() {
      return function() {
        throw new Error('everything is bad!');
      };
    }, {}, 'x').then(null, function(error) {
      expect(error).to.be.instanceof(hinoki.ErrorInFactory);
      expect(error.path[0]).to.equal('x');
      expect(error.error.message).to.equal('everything is bad!');
      done();
    });
  });

  it('should let me register a factory via object', function(done) {
    hinoki({
      x: function() {
        return 11;
      },
      y: function() {
        return 22;
      },
      z: function(x, y) {
        return x + y;
      }
    }, {}, 'z').then(function(z) {
      expect(z).to.equal(33);
      done();
    });
  });

  it('should let me register an async factory', function(done) {
    hinoki(function(key) {
      if(key === 'a') {
        return function() {
          var deferred = Q.defer();
          setTimeout(function() {
            deferred.resolve(123);
          }, 10);
          return deferred.promise;
        };
      }
    }, {}, 'a').then(function(a) {
      expect(a).to.equal(123);
      done();
    });
  });

  it('should fail when async factory rejects', function(done) {
    hinoki(function(key) {
      if(key === 'a') {
        return function() {
          var deferred = Q.defer();
          setTimeout(function() {
            deferred.reject(new Error('everything is bad!'));
          }, 10);
          return deferred.promise;
        };
      }
    }, {}, 'a').then(null, function(error) {
      expect(error).to.be.instanceof(hinoki.PromiseRejectedError);
      expect(error.path[0]).to.equal('a');
      expect(error.error.message).to.equal('everything is bad!');
      done();
    });
  });
});
