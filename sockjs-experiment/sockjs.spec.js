var expect = require('chai').expect;

var http = require('http');
var sockjs = require('sockjs');
var SockJS = require('sockjs-client-node');

describe('sockjs', function() {
  it('should work', function(done) {

    var trace = [];

    var echo = sockjs.createServer();
    echo.on('connection', function(connection) {
      console.log('someone has connected');
      trace.push('server: connection');

      connection.write('hi there');

      connection.on('data', function(m) {
        console.log('server has message', m);
      });

      connection.on('close', function() {
        console.log('someone has disconnected');
        trace.push('server: close');

        expect(trace).to.deep.equal([
          'server: connection',
          'client: onopen',
          'client: hi there',
          'client: onclose',
          'server: close'
        ]);

        done();
      });
    });

    var server = http.createServer();
    echo.installHandlers(server, { prefix: '/echo' });
    server.listen(9999, function() {
      var sock = new SockJS('http://localhost:9999/echo');
      sock.onopen = function() {
        console.log('connected!');
        trace.push('client: onopen');
      };

      sock.onmessage = function(m) {
        console.log('client has message', m);
        trace.push('client: ' + m.data);
        sock.close();
      };

      sock.onclose = function() {
        console.log('disconnected!');
        trace.push('client: onclose');
      };
    });
  });
});
