var assert = require("assert");
var validate = require("jsonschema").validate;

describe("Number validator", function() {
	var schema;
	before(function() {
		schema = {
			"type": "number"
		};
	});

	it("should be OK with integers", function() {		
		var result = validate(123, schema);
		assert.equal(result.errors.length, 0);
	});

	it("should be OK with reals", function() {		
		var result = validate(3.14, schema);
		assert.equal(result.errors.length, 0);
	});

	it("should not be OK with strings", function() {		
		var result = validate("hello", schema);
		assert.notEqual(result.errors.length, 0);
	});
});

describe("Integer validator", function() {
	var schema;
	before(function() {
		schema = {
			"type": "integer"
		};
	});

	it("should be OK with integers", function() {
		var result = validate(123, schema);
		assert.equal(result.errors.length, 0);
	});

	it("should not be OK with reals", function() {		
		var result = validate(3.14, schema);
		assert.notEqual(result.errors.length, 0);
	});

	it("should not be OK with strings", function() {		
		var result = validate("hello", schema);
		assert.notEqual(result.errors.length, 0);
	});
});