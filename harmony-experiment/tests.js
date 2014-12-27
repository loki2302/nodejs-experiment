var assert = require('assert');
var Q = require('q');
var co = require('co');

describe('harmony', function() {
	describe('co', function() {
		it('should let me make successful synchronous calls', function(done) {
			var getDataCallCount = 0;
			function getData(x) {
				++getDataCallCount;

				var deferred = Q.defer();
				setTimeout(function() {
					deferred.resolve('data' + x);
				}, 1);
				return deferred.promise;
			}

			co(function* () {
				var data1 = yield getData(1);
				var data2 = yield getData(2);
				var data3 = yield getData(3);
				return data1 + data2 + data3;
			}).then(function(result) {
				assert.equal(result, 'data1data2data3');
				assert.equal(getDataCallCount, 3);
				done();
			});
		});

		it('should let me make unsuccessful synchronous calls', function(done) {
			var getDataCallCount = 0;
			function getData(x) {
				++getDataCallCount;

				var deferred = Q.defer();
				setTimeout(function() {
					deferred.reject(new Error('error' + x));
				}, 1);
				return deferred.promise;
			}

			co(function* () {
				var data1 = yield getData(1);
				var data2 = yield getData(2);
				var data3 = yield getData(3);
				return data1 + data2 + data3;
			}).then(undefined, function(error) {
				assert.equal(error.message, 'error1');
				assert.equal(getDataCallCount, 1);
				done();
			});
		});
	});

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

		it('should let me get promise result synchronously', function(done) {
			function getData() {
				var deferred = Q.defer();
				setTimeout(function() {
					deferred.resolve('hello data');
				}, 1);
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

		it('should let me get promise rejection as exception', function(done) {
			function getData() {
				var deferred = Q.defer();
				setTimeout(function() {
					deferred.reject(new Error('no data'));
				}, 1);
				return deferred.promise;
			}			

			function* controllerFunc() {
				try {
					var data = yield getData();
					assert.ok(false);
				} catch(e) {
					assert.equal(e.message, 'no data');
					done();
				}				
			}

			var g = controllerFunc();			
			var v = g.next();
			v.value.then(undefined, function(error) {
				g.throw(error);
			});
		});
	});	
});