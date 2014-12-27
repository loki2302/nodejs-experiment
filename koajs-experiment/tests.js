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
			var body = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/',
				json: true
			});
			
			assert.equal(body.message, 'hello there');
		}).then(done, done);
	});
});
