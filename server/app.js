var express = require("express");
var bodyParser = require("body-parser");
var sleep = require("sleep");
var routes = require("./routes.js");

module.exports = function(models, config) {
	var app = express();
	app.use(express.static(__dirname + "/../client/build/"));
	app.use(bodyParser.json());

	if(config && config.delay) {
		app.use(function(req, res, next) {
			sleep.sleep(config.delay);
			next();
		});
	}
	routes.addRoutes(app, models);

	["/", "/notes", "/categories"].forEach(function(route) {
		app.all(route, function(req, res) {
			res.sendFile("index.html", { root: __dirname + "/../client/build/" });
		});
	});

	app.use(function(err, req, res, next) {
		if(error instanceof Error) {
			res.status(500).send({
				message: error.message
			});
		} else {
			res.status(500).send({
				message: "Unexpected error"
			});
		}
	});

	return app;
};
