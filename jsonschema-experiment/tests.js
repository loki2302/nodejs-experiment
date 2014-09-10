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

describe("Note validator", function() {
	var schema;
	before(function() {
		schema = {
			type: "object",
			properties: {
				id: {
					type: "integer",
					required: true
				},
				content: {
					type: "string",
					required: true
				}
			}
		};
	});

	it("should be OK when both id and content are there", function() {
		var result = validate({
			id: 123,
			content: "hello there"
		}, schema);
		assert.equal(result.errors.length, 0);
	});

	it("should not be OK when there's no id", function() {
		var result = validate({			
			content: "hello there"
		}, schema);
		assert.equal(result.errors.length, 1);
	});

	it("should not be OK when id is not integer", function() {
		var result = validate({
			id: "123",
			content: "hello there"
		}, schema);
		assert.equal(result.errors.length, 1);
	});

	it("should not be OK when there's no content", function() {
		var result = validate({
			id: 123
		}, schema);
		assert.equal(result.errors.length, 1);
	});

	it("should not be OK when content is not a string", function() {
		var result = validate({
			id: 123,
			content: {}
		}, schema);
		assert.equal(result.errors.length, 1);
	});

	it("should be OK when there are unexpected properties", function() {
		var result = validate({
			id: 123,
			content: "hello",
			unexpectedProperty1: "unexpected string",
			unexpectedProperty2: 222
		}, schema);
		assert.equal(result.errors.length, 0);
	});
});

describe("Tagged note validator", function() {
	var schema;
	before(function() {
		schema = {
			type: "object",
			properties: {
				id: {
					type: "integer",
					required: true
				},
				content: {
					type: "string",
					required: true
				},
				tags: {
					type: "array",
					required: false,
					items: {
						type: "object",
						properties: {
							id: {
								type: "integer",
								required: true
							},
							name: {
								type: "string",
								required: false
							}
						}
					}
				}
			}
		};
	});

	it("should be OK when tags are there and they have names", function() {
		var result = validate({
			id: 123,
			content: "hello",
			tags: [
				{ id: 111, name: "tag one" },
				{ id: 222, name: "tag two" },
				{ id: 333, name: "tag three" }
			]
		}, schema);
		assert.equal(result.errors.length, 0);
	});

	it("should be OK when tags are there and they don't have names", function() {
		var result = validate({
			id: 123,
			content: "hello",
			tags: [
				{ id: 111 },
				{ id: 222 },
				{ id: 333 }
			]
		}, schema);
		assert.equal(result.errors.length, 0);
	});

	it("should be OK when tags are not there", function() {
		var result = validate({
			id: 123,
			content: "hello"
		}, schema);
		assert.equal(result.errors.length, 0);
	});	
});