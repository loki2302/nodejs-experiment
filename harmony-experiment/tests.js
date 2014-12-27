var assert = require('assert');
var Q = require('q');

describe('harmony', function() {
	describe('generator', function() {
		it('should work', function() {
			function* hiThereGenerator() {
				yield 'hi';
				yield 'there';
			}

			var it = hiThereGenerator();
			var v = it.next();
			assert.equal(v.value, 'hi');
			assert.equal(v.done, false);

			v = it.next();
			assert.equal(v.value, 'there');
			assert.equal(v.done, false);

			v = it.next();
			assert.equal(v.value, undefined);
			assert.equal(v.done, true);
		});

		it('should let me make promises look synchronous', function(done) {
			function getData() {
				var deferred = Q.defer();
				setTimeout(function() {
					deferred.resolve('hello data');
				}, 100);
				return deferred.promise;
			}

			function* controllerFunc() {
				var data = yield getData();
				assert.equal(data, 'hello data');
				done();
			}

			var g = controllerFunc();
			
			var v = g.next();
			v.value.then(function(result) {
				g.next(result);
			});
		});
	});	
});