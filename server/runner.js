var makeApp = require("./app.js");
var models = require("./models.js");

models.initialize(function(error) {
	if(error) {
		throw new Error("Failed to initialize models");
	}

	var app = makeApp(models, {
		delay: 1
	});
	var server = app.listen(3000, function() {
		console.log("Listening at %j", server.address());
	});
});
