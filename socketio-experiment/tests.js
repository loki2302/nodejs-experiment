var http = require("http");
var makeSocketIoServer = require("socket.io");

exports.basicScenario = function(test) {
  test.expect(7);

  var server = http.Server();
  var io = makeSocketIoServer(server, {
    // The entire app won't shutdown as long as at least
    // one connection is considered alive. In practice this
    // results in quite a long delay between call to server.close()
    // and actual termination. These timeouts make shutdown faster.
    // What is the right solution here?
    pingInterval: 500,
    pingTimeout: 500
  });

  io.on("connection", function(socket) {
    console.log("connection!");
    test.ok(true);

    socket.on("hello", function(data) {
      console.log("server received hello, data = %j", data);
      test.ok(true);
      
      console.log("emitting personal hello to client");
      socket.emit("personal hello", {
        message: "hi there personal"
      });

      console.log("emitting common hello to client");
      io.emit("common hello", {
        message: "hi there common"
      });
    });

    // this gets triggered AFTER server reports it stopped :-/
    socket.on("disconnect", function() {      
      console.log("client disconnected");
    });
  });

  server.listen(3000, function() {
    console.log("listening: %j", server.address());

    var makeSocketIoClient = require("socket.io-client");
    var socket = makeSocketIoClient("http://localhost:3000");

    socket.on("connect", function() {
      test.ok(true);

      socket.on("personal hello", function(data) {
        console.log("client has personal hello: %j", data);
        test.ok(true);
        gotResponse();        
      });

      socket.on("common hello", function(data) {
        console.log("client has common hello: %j", data);
        test.ok(true);
        gotResponse();        
      });

      socket.on("disconnect", function() {        
        console.log("disconnected...");
        test.ok(true);

        server.close(function() {
          console.log("done");
          test.ok(true);
          test.done();
        });       
      });

      var count = 0;
      function gotResponse() {
        ++count;

        if(count == 2) {
          console.log("disconnecting...");
          socket.disconnect();
        }
      };

      socket.emit("hello", {"clientSays": "omg!"});   
    });
  });
};