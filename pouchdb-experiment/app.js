var PouchDB = require("pouchdb");

var NoteService = function() {
	this.db = new PouchDB("notes");
};

NoteService.prototype.createNote = function(note, success, error) {
	this.db.post(note, function(err, result) {
		if(err) {
			error(err);
		}

		var noteId = result.id;
		success(noteId);
	});
};

NoteService.prototype.getNote = function(noteId, success, error) {
	this.db.get(noteId, function(err, result) {
		if(err) {
			error(err);
		}

		success(result);
	});
};

exports.canCreateNote = function(test) {
	PouchDB.destroy("notes", function(err, info) {
		var notes = new NoteService();
		notes.createNote({
			title: "title 1",
			text: "text 1"
		}, function(result) {
			console.log("RESULT", result);

			var noteId = result;
			notes.getNote(noteId, function(result) {
				console.log("RESULT", result);
				test.done();
			}, function(error) {
				test.ifError(error);
				console.log("ERROR", error)
				test.done();
			});			
		}, function(error) {
			test.ifError(error);
			console.log("ERROR", error);
			test.done();
		});
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
