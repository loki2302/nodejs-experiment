var express = require("express");
var request = require("request");
var assert = require("assert");

describe("I can", function() {
	it("use route handler", function(done) {
		var app = express();
		app.get("/", function(req, res) {
			res.send("hello");
		});
		var server = app.listen(3000, function() {
			request.get("http://localhost:3000/", function(error, response, body) {
				assert.equal(body, "hello");

				server.close(function() {
					done();
				});		
			});
		});
	});

	it("chain handlers for a single route", function(done) {
		var app = express();
		app.get("/", function(req, res, next) {
			req.customData = "one";
			next();
		}, function(req, res, next) {
			assert.equal(req.customData, "one");
			req.customData += "two";
			next();
		}, function(req, res, next) {
			assert.equal(req.customData, "onetwo");
			req.customData += "three";
			next();
		}, function(req, res) {
			assert.equal(req.customData, "onetwothree");
			res.send(req.customData);
		});
		var server = app.listen(3000, function() {
			request.get("http://localhost:3000/", function(error, response, body) {
				assert.equal(body, "onetwothree");

				server.close(function() {
					done();
				});		
			});
		});
	});

	it("chain common handlers", function(done) {
		var app = express();
		app.use(function(req, res, next) {
			req.customData = "before";
			next();
		});
		app.get("/", function(req, res, next) {
			req.customData += "in";
			next();
		});
		app.use(function(req, res) {
			req.customData += "after";
			res.send(req.customData);
		});
		var server = app.listen(3000, function() {
			request.get("http://localhost:3000/", function(error, response, body) {
				assert.equal(body, "beforeinafter");

				server.close(function() {
					done();
				});		
			});
		});
	});

	it("have an error handler", function(done) {
		var app = express();
		app.get("/", function(req, res, next) {
			next(new Error("hello"));
		});
		app.use(function(err, req, res, next) {
			assert.equal(err.message, "hello");
			res.send("got error");
		});
		var server = app.listen(3000, function() {
			request.get("http://localhost:3000/", function(error, response, body) {
				assert.equal(body, "got error");

				server.close(function() {
					done();
				});		
			});
		});
	});

	describe("use param to validate and sanitize id", function() {
		var server;
		beforeEach(function(callback) {
			var app = express();
			app.param("id", function(req, res, next, id) {
				var idIntOrNaN = parseInt(id);
				if(isNaN(idIntOrNaN)) {
					res.status(404).send({
						message: "no such id"
					});
					return;
				}

				req.id = idIntOrNaN;
				next();
			});
			app.get("/hello/:id", function(req, res) {
				res.status(200).send({
					id: req.id,
					typeOfId: typeof req.id
				});
			});
			app.get("/bye/:bye_id", function(req, res) {
				res.status(200).send({
					id: req.params.bye_id,
					typeOfId: typeof req.params.bye_id
				});

			});
			server = app.listen(3000, function() {
				callback();
			});
		});

		afterEach(function(callback) {
			server.close(function() {
				callback();
			});
		});

		it("hello should 404 when id is not a number", function(done) {
			request.get({ 
				url: "http://localhost:3000/hello/qwerty", 
				json: true 
			}, function(error, response, body) {
				assert.equal(response.statusCode, 404);
				assert.equal(body.message, "no such id");
				done();		
			});
		});

		it("hello should 200 when id is a number", function(done) {
			request.get({ 
				url: "http://localhost:3000/hello/123", 
				json: true 
			}, function(error, response, body) {
				assert.equal(response.statusCode, 200);
				assert.equal(body.id, 123);
				assert.equal(body.typeOfId, "number");
				done();		
			});
		});

		it("bye should 200 and string when id is string", function(done) {
			request.get({ 
				url: "http://localhost:3000/bye/qwerty", 
				json: true 
			}, function(error, response, body) {
				assert.equal(response.statusCode, 200);
				assert.equal(body.id, "qwerty");
				assert.equal(body.typeOfId, "string");
				done();		
			});
		});

		it("bye should 200 and string when id is numeric string", function(done) {
			request.get({ 
				url: "http://localhost:3000/bye/123", 
				json: true 
			}, function(error, response, body) {
				assert.equal(response.statusCode, 200);
				assert.equal(body.id, "123");
				assert.equal(body.typeOfId, "string");
				done();		
			});
		});
	});
});
