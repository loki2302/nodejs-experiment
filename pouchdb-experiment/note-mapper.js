var Note = require("./note").Note;

var NoteMapper = function() {	
};

NoteMapper.prototype.noteFromNoteRow = function(noteRow) {
	return new Note({
		id: noteRow._id,
		title: noteRow.title,
		text: noteRow.text
	});
};

NoteMapper.prototype.notesFromNoteRows = function(noteRows) {
	var self = this;
	return noteRows.map(function(noteRow) {
		return self.noteFromNoteRow(noteRow.doc);
	});
};

exports.NoteMapper = NoteMapper;