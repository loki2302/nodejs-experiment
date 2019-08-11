var assert = require("assert");

describe("1 + 2", function() {
	it("should be 3 even with setTimeout()", function(done) {
		setTimeout(function() {
			assert.equal(3, 1 + 2);
			done();
		}, 500);
	});
});

describe("a weird approach to computing 1 + 2", function() {
	var one = 0;
	before(function(done) {
		setTimeout(function() {
			one = one + 5;
			done();
		}, 500);
	});

	beforeEach(function(done) {
		setTimeout(function() {
			one = one - 4;
			done();
		}, 500);
	});

	it("should work", function(done) {
		setTimeout(function() {
			assert.equal(3, one + 2);
			done();
		}, 500);
	});
});