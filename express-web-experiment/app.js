var express = require("express");
var http = require("http");
var path = require("path");
var consolidate = require("consolidate");
var swig = require("swig");

swig.init({ root: __dirname + "/views" });

var app = express();

app.engine("html", consolidate.swig);
app.set("view engine", "html");
app.use(express.logger("dev"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", function(request, response) {
  response.render("index");
});

app.get("/calculator", function(request, response) {
  response.render("calculator");
});

app.get("/api/addNumbers/", function(request, response) {
  var a = parseInt(request.query.a);
  var b = parseInt(request.query.b);
  response.send({
    "result": a + b
  });
});

http.createServer(app).listen(8080);
