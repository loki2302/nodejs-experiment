var express = require("express");
var sanitize = require("validator").sanitize;

app = express();

app.use(express.bodyParser());

app.get("/api/addNumbers/", function(request, response) {
  var a = sanitize(request.query.a).toInt();
  var b = sanitize(request.query.b).toInt();

  var result = {
    "result": a + b,
    "message": "processed GET-request"
  };

  response.send(result);
});

app.post("/api/addNumbers/", function(request, response) {
  var a = sanitize(request.body.a).toInt();
  var b = sanitize(request.body.b).toInt();

  var result = {
    "result": a + b,
    "message": "processed POST-request"
  };

  response.send(result);
});

app.listen(8080);