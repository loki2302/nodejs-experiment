var express = require("express");
var expressValidator = require("express-validator");

app = express();

app.use(express.bodyParser());
app.use(expressValidator);

app.get("/api/addNumbers/", function(request, response) {
  request.assert("a", "Invalid a").isInt();
  request.assert("b", "Invalid b").isInt();

  var errors = request.validationErrors();
  if(!!errors) {
    console.log("errors:");
    console.log(errors);
    response.send(errors);
    return;
  }

  var a = request.sanitize("a").toInt();
  var b = request.sanitize("b").toInt();

  var result = {
    "result": a + b,
    "message": "processed GET-request"
  };

  response.send(result);
});

app.post("/api/addNumbers/", function(request, response) {
  request.checkBody("a", "Invalid a").isInt();
  request.checkBody("b", "Invalid b").isInt();

  var errors = request.validationErrors();
  if(!!errors) {
    console.log("errors:");
    console.log(errors);
    response.send(errors);
    return;
  }

  var a = request.sanitize("a").toInt();
  var b = request.sanitize("b").toInt();

  var result = {
    "result": a + b,
    "message": "processed POST-request"
  };

  response.send(result);
});

app.listen(8080);