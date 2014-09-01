var assert = require("assert");
var request = require("request");

var models = require("../models.js");
var makeApp = require("../app.js");

function url(path) {
	return "http://localhost:3000" + path;
}

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

	it("should have no notes by default", function(done) {
		var params = { 
			url: url("/notes/"), 
			json: true 
		};
		request.get(params, function(error, response, body) {
			assert.equal(response.statusCode, 200);			
			assert.equal(body.length, 0);
			done();
		});
	});

	it("should have no categories by default", function(done) {
		var params = { 
			url: url("/categories/"), 
			json: true 
		};
		request.get(params, function(error, response, body) {
			assert.equal(response.statusCode, 200);			
			assert.equal(body.length, 0);
			done();
		});
	});

	it("should let me create a note", function(done) {
		var params = {
			url: url("/notes/"),
			json: {
				content: "hello"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 201);
			assert.equal(body.id, 1);
			assert.equal(body.content, "hello");
			done();
		});
	});

	it("should not let me create a note if fields are not valid", function(done) {
		var params = {
			url: url("/notes/"),
			json: {
				content: ""
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 400);
			assert.ok("content" in body);
			done();
		});
	});

	it("should let me create a category", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 201);
			assert.equal(body.id, 1);
			assert.equal(body.name, "js");
			done();
		});
	});

	it("should not let me create a category if fields are not valid", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: ""
			}
		};
		request.post(params, function(error, response, body) {
			assert.equal(response.statusCode, 400);
			assert.ok("name" in body);
			done();
		});
	});

	it("should not let me create a category if it already exists", function(done) {
		var params = {
			url: url("/categories/"),
			json: {
				name: "js"
			}
		};
		request.post(params, function(error, response, body) {
			request.post(params, function(error, response, body) {
				assert.equal(response.statusCode, 409);
				assert.ok("message" in body);
				done();
			});
		});
	});
});
