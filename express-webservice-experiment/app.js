var express = require("express");

app = express();

app.use(express.bodyParser());

app.get("/api/addNumbers/", function(request, response) {
  var a = parseInt(request.query.a);
  var b = parseInt(request.query.b);

  var result = {
    "result": a + b,
    "message": "processed GET-request"
  };

  response.send(result);
});

app.post("/api/addNumbers/", function(request, response) {
  var a = parseInt(request.body.a);
  var b = parseInt(request.body.b);

  var result = {
    "result": a + b,
    "message": "processed POST-request"
  };

  response.send(result);
});

app.listen(8080);