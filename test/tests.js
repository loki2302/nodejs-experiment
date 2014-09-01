var assert = require("assert");
var request = require("request");

var app = require("../app.js").app;

describe("app", function() {
	var server;
	beforeEach(function(done) {
		server = app.listen(3000, function() {
			done();
		});
	});

	afterEach(function(done) {
		server.close(function() {
			done();
		});		
	});

	it("should respond with 200 and 'hello' on GET /", function(done) {
		request.get("http://localhost:3000/", function(error, response, body) {
			assert.equal(response.statusCode, 200);
			assert.equal(body, "hello");
			done();
		});		
	});
});
