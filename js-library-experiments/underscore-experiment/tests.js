var _ = require("underscore");
var assert = require("assert");

describe("I can use underscore to", function() {
	it("bind function arguments", function(done) {
		function add(x, y) { 
			return x + y; 
		};
		
		var addOne = _.bind(add, null, 1);
		assert.equal(addOne(2), 3);
		done();
	});
});