var http = require('http');
var sockjs = require('sockjs');

    var echo = sockjs.createServer();
    echo.on('connection', function(connection) {
      console.log('someone has connected');

      connection.on('close', function() {
        console.log('someone has disconnected');
      });
    });

    var server = http.createServer();
    echo.installHandlers(server, { prefix: '/echo' });
    server.listen(9999);
