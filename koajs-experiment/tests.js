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

	it('should have no notes by default', function(done) {
		co(function* () {
			var notes = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/notes',
				json: true
			});			
			assert.equal(notes.length, 0);
		}).then(done, done);
	});

	it('should let me create a note', function(done) {
		co(function* () {
			var note = yield rp({
				method: 'POST',
				url: 'http://localhost:3000/notes',
				json: true,
				body: {
					content: 'hello there'
				}
			});
			assert.equal(note.id, 1);
			assert.equal(note.content, 'hello there');

			var notes = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/notes',
				json: true
			});			
			assert.equal(notes.length, 1);
		}).then(done, done);
	});

	it('should let me get a note by id', function(done) {
		co(function* () {
			var note = yield rp({
				method: 'POST',
				url: 'http://localhost:3000/notes',
				json: true,
				body: {
					content: 'hello there'
				}
			});
			assert.equal(note.id, 1);
			assert.equal(note.content, 'hello there');

			var noteId = note.id;
			note = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/notes/' + noteId,
				json: true
			});			
			assert.equal(note.id, 1);
			assert.equal(note.content, 'hello there');
		}).then(done, done);
	});

	it('should 404 when I want to get note that does not exist', function(done) {
		co(function* () {
			try {
				yield rp({
					method: 'GET',
					url: 'http://localhost:3000/notes/' + 123,
					json: true
				});
			} catch(e) {
				assert.equal(e.statusCode, 404);
				assert.equal(e.response.body, 'Note not found');
			}
		}).then(done, done);
	});

	it('should let me delete a note', function(done) {
		co(function* () {
			var note = yield rp({
				method: 'POST',
				url: 'http://localhost:3000/notes',
				json: true,
				body: {
					content: 'hello there'
				}
			});

			yield rp({
				method: 'DELETE',
				url: 'http://localhost:3000/notes/' + note.id
			});

			var notes = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/notes',
				json: true
			});
			assert.equal(notes.length, 0);
		}).then(done, done);
	});

	it('should 404 when I want to delete a note that does not exist', function(done) {
		co(function* () {
			try {
				yield rp({
					method: 'DELETE',
					url: 'http://localhost:3000/notes/' + 123,
					json: true
				});
			} catch(e) {
				assert.equal(e.statusCode, 404);
				assert.equal(e.response.body, 'Note not found');	
			}
		}).then(done, done);
	});

	it('should let me update a note', function(done) {
		co(function* () {
			var note = yield rp({
				method: 'POST',
				url: 'http://localhost:3000/notes',
				json: true,
				body: {
					content: 'hello there'
				}
			});

			var noteId = note.id;
			var response = yield rp({
				method: 'PUT',
				url: 'http://localhost:3000/notes/' + noteId,
				json: true,
				body: {
					content: 'hi there'
				}
			});
			assert.equal(response.message, 'ok');

			note = yield rp({
				method: 'GET',
				url: 'http://localhost:3000/notes/' + noteId,
				json: true
			});
			assert.equal(note.id, noteId);
			assert.equal(note.content, 'hi there');
		}).then(done, done);
	});

	it('should 404 when I want to update a note that does not exist', function(done) {
		co(function* () {
			try {
				var response = yield rp({
					method: 'PUT',
					url: 'http://localhost:3000/notes/' + 123,
					json: true,
					body: {
						content: 'hi there'
					}
				});
			} catch(e) {
				assert.equal(e.statusCode, 404);
				assert.equal(e.response.body, 'Note not found');
			}
		}).then(done, done);
	});
});
