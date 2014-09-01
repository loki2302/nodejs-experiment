var assert = require("assert");
var request = require("request");

var models = require("../models.js");
var makeApp = require("../app.js");

describe("app", function() {
	var server;
	beforeEach(function(done) {
		models.reset().then(function() {
			var app = makeApp(models);
			server = app.listen(3000, function() {
				done();
			});
		}, function(error) {
			throw new Error("Failed to initialize models");
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

	it("should have no notes by default", function(done) {
		request.get({ url: "http://localhost:3000/notes/", json: true }, function(error, response, body) {
			assert.equal(response.statusCode, 200);			
			assert.equal(body.length, 0);
			done();
		});
	});

	it("should have no categories by default", function(done) {
		request.get({ url: "http://localhost:3000/categories/", json: true }, function(error, response, body) {
			assert.equal(response.statusCode, 200);			
			assert.equal(body.length, 0);
			done();
		});
	});
});
