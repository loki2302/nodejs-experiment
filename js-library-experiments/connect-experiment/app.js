var connect = require("connect");

var port = 8080;                                     
connect.createServer(connect.static("static")).listen(port);
console.log("running at :" + port);