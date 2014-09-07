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

	it("chain handlers", function(done) {
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
});
