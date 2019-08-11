var assert = require("assert");
var Q = require("q");

describe("i can", function() {
	describe("use defer", function() {
		it("to make a promise and resolve it later", function(done) {
			var deferred = Q.defer();
			setTimeout(function() {
				deferred.resolve(123);
			}, 1);

			var promise = deferred.promise;
			promise.then(function(result) {
				assert.equal(123, result);
				done();
			}, function(error) {
				assert.ok(false, "should never get here");
			});
		});

		it("to make a promise and reject it later", function(done) {
			var deferred = Q.defer();
			setTimeout(function() {
				deferred.reject("error happened");
			}, 1);

			var promise = deferred.promise;
			promise.then(function() {
				assert.ok(false, "should never get here");
			}, function(error) {
				assert.equal("error happened", error);
				done();
			});
		});
	});

	describe("make promise from a function call", function() {
		it("and get it resolved with function call result", function(done) {
			var promise = Q.fcall(function() {
				return 123;
			});
			promise.then(function(result) {
				assert.equal(123, result);
				done();
			});
		});

		it("and get it rejected with what function call throws", function(done) {
			var promise = Q.fcall(function() {
				throw "error happened"
			});
			promise.then(null, function(error) {
				assert.equal("error happened", error);
				done();
			});
		});

		it("even if function has parameters", function(done) {
			var promise = Q.fcall(function(a, b) {
				return a + b;
			}, 1, 2);
			promise.then(function(result) {
				assert.equal(3, result);
				done();
			});
		});
	});

	describe("chain promises", function() {
		it("to eventually get a result", function(done) {
			Q.fcall(function() {
				return 1;
			}).then(function(result) {
				return result + 2;
			}).then(function(result) {
				assert.equal(3, result);
				done();
			});			
		});

		it("to get a rejection that happened on top of chain", function(done) {
			Q.fcall(function() {
				throw "error happened";
			}).then(function(result) {
				assert.ok(false, "should never get here");
				return result + 2;
			}).then(function(result) {
				assert.ok(false, "should never get here");
			}).then(null, function(error) {
				assert.equal("error happened", error);
				done();
			});
		});
	});

	describe("combine promises", function() {
		it("to get them resolved at once", function(done) {
			Q.all([
				Q.fcall(function() { return 1; }),
				Q.fcall(function() { return 2; }),
				Q.fcall(function() { return 3; })
			]).then(function(result) {				
				assert.equal(result.length, 3);
				assert.ok(result.indexOf(1) !== -1);
				assert.ok(result.indexOf(2) !== -1);
				assert.ok(result.indexOf(3) !== -1);
				done();
			});
		});
	});
});
