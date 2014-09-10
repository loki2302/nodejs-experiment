var assert = require("assert");
var validate = require("jsonschema").validate;

describe("Number validator", function() {
	var schema;
	before(function() {
		schema = {
			"type": "number"
		};
	});

	it("should be OK with numbers", function() {		
		var result = validate(123, schema);
		assert.equal(result.errors.length, 0);
	});

	it("should note be OK with strings", function() {		
		var result = validate("hello", schema);
		assert.notEqual(result.errors.length, 0);
	});
});