var PouchDB = require("pouchdb");

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
