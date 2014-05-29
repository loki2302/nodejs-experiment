var PouchDB = require("pouchdb");

var NoteService = function(noteMapper) {
	this.db = new PouchDB("notes");
	this.noteMapper = noteMapper;
};

NoteService.prototype.createNote = function(note, callback) {
	this.db.post(note, function(err, result) {		
		if(err) {
			callback(err, undefined);
		}

		var noteId = result.id;
		callback(undefined, noteId);
	});
};

NoteService.prototype.getNote = function(noteId, callback) {
	var self = this;
	self.db.get(noteId, function(err, result) {
		if(err) {
			callback(err, undefined);
		}

		var note = self.noteMapper.noteFromNoteRow(result);
		callback(undefined, note);
	});
};

exports.NoteService = NoteService;