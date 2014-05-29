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

exports.NoteMapper = NoteMapper;