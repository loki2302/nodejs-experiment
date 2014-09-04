var express = require("express");
var bodyParser = require("body-parser");
var noteRoutes = require("./routes/notes.js");
var categoryRoutes = require("./routes/categories.js");

module.exports = function(models) {
	var app = express();
	app.use(express.static(__dirname + "/../client/build/"));
	app.use(bodyParser.json());
	noteRoutes.addRoutes(app, models);
	categoryRoutes.addRoutes(app, models);

	return app;
};
