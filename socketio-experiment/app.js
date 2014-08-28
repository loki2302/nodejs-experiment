var http = require("http");
var makeSocketIoServer = require("socket.io");

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

	socket.on("hello", function(data) {
		console.log("server received hello, data = %j", data);
		
		console.log("emitting personal hello to client");
		socket.emit("personal hello", {
			message: "hi there personal"
		});

		console.log("emitting common hello to client");
		io.emit("common hello", {
			message: "hi there common"
		});
	});

	socket.on("disconnect", function() {
		console.log("client disconnected");
	});
});

server.listen(3000, function() {
	console.log("listening: %j", server.address());

	var makeSocketIoClient = require("socket.io-client");
	var socket = makeSocketIoClient("http://localhost:3000");

	socket.on("connect", function() {
		socket.on("personal hello", function(data) {
			console.log("client has personal hello: %j", data);
			gotResponse();
		});

		socket.on("common hello", function(data) {
			console.log("client has common hello: %j", data);
			gotResponse();
		});

		socket.on("disconnect", function() {
			console.log("disconnected...");
			server.close(function() {
				console.log("done");
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
