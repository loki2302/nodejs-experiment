var express = require("express");
var bodyParser = require("body-parser");

module.exports = function(models) {
	var app = express();
	app.use(bodyParser.json());

	app.get("/", function(req, res) {
		res.status(200);
		res.send("hello");
	});

	app.get("/notes/", function(req, res, next) {
		models.Note.findAll().success(function(notes) {
			res.status(200);
			res.send(notes);
		}).error(function(error) {
			next(error);
		});
	});

	app.get("/categories/", function(req, res, next) {
		models.Category.findAll().success(function(categories) {
			res.status(200);
			res.send(categories);
		}).error(function(error) {
			next(error);
		});
	});

	return app;
};
