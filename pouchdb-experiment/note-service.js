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

NoteService.prototype.getAllNotes = function(callback) {
	var self = this;
	self.db.allDocs({
		include_docs: true,
		descending: true
	}, function(err, result) {
		if(err) {
			callback(err, undefined);
		}

		var notes = self.noteMapper.notesFromNoteRows(result.rows);
		callback(undefined, notes);
	});
};

exports.NoteService = NoteService;