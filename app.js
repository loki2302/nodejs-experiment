var express = require("express");

var app = express();
app.get("/", function(req, res) {
	res.status(200);
	res.send("hello");
});

exports.app = app;
