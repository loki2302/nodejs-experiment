var assert = require("assert");

describe("Adding one and", function() {
	it("two should be three", function() {
		assert.equal(3, 1 + 2);
	});

	it("five should be six", function() {
		assert.equal(6, 1 + 5);
	});
});

describe("Adding two and", function() {
	it("three should be five", function() {
		assert.equal(5, 2 + 3);
	});
});

describe("Adding", function() {
	describe("three", function() {
		it("and one should be four", function() {
			assert.equal(4, 3 + 1);
		});

		it("and two should be five", function() {
			assert.equal(5, 3 + 2);
		});
	});

	describe("eleven", function() {
		it("and two should be thirteen", function() {
			assert.equal(13, 11 + 2);
		});
	});
});