var http = require("http");
var jade = require("jade");
var fs = require("fs");

var template = fs.readFileSync("index.jade", "utf8");
var compiledTemplate = jade.compile(template);
var content = compiledTemplate();

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-type": "text/html"});
  response.end(content);
}).listen(8080);

console.log("Started");