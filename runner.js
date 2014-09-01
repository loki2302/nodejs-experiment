var app = require("./app.js").app;

var server = app.listen(3000, function() {
	console.log("Listening at %j", server.address());
});
