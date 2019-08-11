var express = require("express");
var bodyParser = require("body-parser");
var expressValidator = require("express-validator");

var app = express();
app.use(bodyParser.json());
app.use(expressValidator());

// GET http://localhost:3000/api/addNumbers/?a=2&b=3
app.get("/api/addNumbers/", function(req, res) {
  req.assert("a", "Invalid a").isInt();
  req.assert("b", "Invalid b").isInt();
  
  var errors = req.validationErrors();
  if(!!errors) {    
    var validationErrorBody = makeValidationErrorBody(errors);
    res.status(400);
    res.send(validationErrorBody);
    return;
  }

  var a = req.sanitize("a").toInt();
  var b = req.sanitize("b").toInt();

  var result = {
    "result": a + b,
    "message": "processed GET-request"
  };

  res.status(200);
  res.send(result);
});

// POST http://localhost:3000/api/addNumbers/
// { "a": 2, "b": 3 }
app.post("/api/addNumbers/", function(req, res) {
  req.checkBody("a", "Invalid a").isInt();
  req.checkBody("b", "Invalid b").isInt();

  var errors = req.validationErrors();
  if(!!errors) {    
    var validationErrorBody = makeValidationErrorBody(errors);
    res.status(400);
    res.send(validationErrorBody);
    return;
  }

  var a = req.sanitize("a").toInt();
  var b = req.sanitize("b").toInt();

  var result = {
    "result": a + b,
    "message": "processed POST-request"
  };

  res.status(200);
  res.send(result);
});

function makeValidationErrorBody(validationErrors) {
  var errors = {};
  for(var i = 0; i < validationErrors.length; ++i) {
    var validationError = validationErrors[i];
    var paramName = validationError.param;
    var message = validationError.msg;
    errors[paramName] = message;
  }

  return errors;
};

exports.app = app;