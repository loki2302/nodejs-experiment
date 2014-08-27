var app = require("./app.js").app;

var server = app.listen(3000, function() {
  console.log("listening: %j", server.address());
  // server.close(function() {
  //   console.log("not listening");
  // });
});
