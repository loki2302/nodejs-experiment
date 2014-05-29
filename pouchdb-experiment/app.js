var PouchDB = require("pouchdb");
var async = require("async");

var Note = function(values) {
	this.id = values.id || null;
	this.title = values.title || "";
	this.text = values.text || "";
};

var NoteMapper = function() {	
};

NoteMapper.prototype.noteFromNoteRow = function(noteRow) {
	return new Note({
		id: noteRow._id,
		title: noteRow.title,
		text: noteRow.text
	});
};

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

exports.canCreateNote = function(test) {
	async.waterfall([function(callback) {
		PouchDB.destroy("notes", function(err, info) {
			callback(err);
		});
	}, function(callback) {
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
			callback(err, result);
		});
	}], function(err, result) {
		console.log(err, result);
		test.ifError(err);
		test.done();
	});
};

exports.dummy = function(test) {
	PouchDB.destroy("notes", function(err, info) {
		// intentionally ignoring error here

		var db = new PouchDB("notes");
		var note = {
			title: "note one",
			text: "text for note one"
		};
		db.post(note, function(err, result) {
			test.ifError(err, "post() failed");
			// that's how you do it in non-test environment
			// if(err) {
			//   throw "post() failed";
			// }

			console.log("Inserted!");
			console.log(result);

			db.allDocs({
				include_docs: true,
				descending: true
			}, function(err, rowsDoc) {
				test.ifError(err, "allDocs() failed");

				console.log("Fetching!");
				console.log(rowsDoc);

				var numberOfDocuments = rowsDoc.rows.length;
				for(var i = 0; i < numberOfDocuments; ++i) {
					var doc = rowsDoc.rows[i].doc;
					console.log("Got note", {
						id: doc._id,
						title: doc.title,
						text: doc.text
					});
				}

				test.equal(numberOfDocuments, 1, "expected exactly 1 document");
				test.done();					
			});
		});
	});		
};
