var swig = require("swig");
var http = require("http");

swig.init({
  root: "."
});

var index = swig.compileFile("./index.html");
var other = swig.compileFile("./other.html");

http.createServer(function(request, response) {
  var url = request.url;

  console.log("request: " + url);

  if(url === "/") {
    response.writeHead(200, {"Content-type": "text/html"});
    response.end(index.render());
  } else if(url === "/other.html") {
    response.writeHead(200, {"Content-type": "text/html"});
    response.end(other.render());
  } else {
    response.writeHead(404);
    response.end();
  }
}).listen(8080);

console.log("Started");