var PouchDB = require("pouchdb");
var async = require("async");
var NoteMapper = require("./note-mapper.js").NoteMapper;
var NoteService = require("./note-service.js").NoteService;

module.exports = {
	setUp: function(done) {
		PouchDB.destroy("notes", function(err, info) {
			done(err);
		});
	},

	canCreateNote: function(test) {
		async.waterfall([function(callback) {
			var noteMapper = new NoteMapper();
			var notes = new NoteService(noteMapper);
			callback(null, notes);
		}, function(notes, callback) {
			notes.createNote({
				title: "title 1",
				text: "text 1"
			}, function(err, noteId) {
				callback(err, notes, noteId);
			});
		}, function(notes, noteId, callback) {
			notes.getNote(noteId, function(err, result) {
				test.equal(result.id, noteId);
				test.equal(result.title, "title 1");
				test.equal(result.text, "text 1");
				callback(err, result);
			});
		}], function(err, result) {
			console.log(err, result);
			test.ifError(err);
			test.done();
		});
	},

	canGetAllNotes: function(test) {
		async.waterfall([function(callback) {
			var noteMapper = new NoteMapper();
			var noteService = new NoteService(noteMapper);
			callback(null, noteService);
		}, function(noteService, callback) {
			noteService.createNote({
				title: "title 1",
				text: "text 1"
			}, function(err, noteId) {
				callback(err, noteService);
			});
		}, function(noteService, callback) {
			noteService.createNote({
				title: "title 2",
				text: "text 2"
			}, function(err, noteId) {
				callback(err, noteService);
			});
		}, function(noteService, callback) {
			noteService.getAllNotes(function(err, notes) {
				test.equal(notes.length, 2);

				var note1 = notes.filter(function(n) { return n.title === 'title 1'; })[0];
				test.equal(note1.title, 'title 1');
				test.equal(note1.text, 'text 1');

				var note2 = notes.filter(function(n) { return n.title === 'title 2'; })[0];
				test.equal(note2.title, 'title 2');
				test.equal(note2.text, 'text 2');				

				callback(err, notes);
			});
		}], function(err, result) {
			console.log(err, result);
			test.ifError(err);
			test.done();
		});
	}
};
