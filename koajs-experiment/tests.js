var app = require('./app');
var rp = require('request-promise');
var co = require('co');
var assert = require('assert');

describe('app', function() {
	var server;

	beforeEach(function(done) {
		co(function* () {
			server = yield app();
			done();
		});
	});

	afterEach(function(done) {
		server.close(function() {
			server = null;
			done();
		});
	});

	it('should let me access it', function(done) {
		co(function* () {
			var body = yield rp('http://localhost:3000/');
			assert.equal(body, 'hello there');
			done();
		});
	});
});
