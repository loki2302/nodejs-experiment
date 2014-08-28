var assert = require("assert");

describe("1 + 2", function() {
	it("should be 3 even with setTimeout()", function(done) {
		setTimeout(function() {
			assert.equal(3, 1 + 2);
			done();
		}, 500);
	});
});