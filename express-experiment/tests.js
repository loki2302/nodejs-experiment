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
});
