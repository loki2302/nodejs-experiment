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
});