var DAO = require("./dao.js").DAO;

exports.setUp = function(callback) {
	this.dao = new DAO();
	this.dao.initialize(function() {
		callback();
	}, function() {
		throw "initialize() failed";
	});
};

exports.tearDown = function(callback) {
	this.dao.drop(function() {
		callback();
	}, function() {
		throw "drop() failed";
	});
};

exports.thereAreNoNotesByDefault = function(test) {
	var dao = this.dao;
	dao.getAllNotes(function(notes) {
		test.equal(notes.length, 0);

		dao.countNotes(function(count) {
			test.equal(count, 0);
			test.done();
		}, function() {
			test.ok(false, "countNotes() failed");
		});
	}, function() {
		test.ok(false, "getAllNotes() failed");
	});
};

exports.canCreateNote = function(test) {
	var dao = this.dao;
	var fields = {
		title: "title 1", 
		description: "description 1"
	};
	dao.createNote(fields, function(note) {
		test.equal(note.id, 1);
		test.equal(note.title, "title 1");
		test.equal(note.description, "description 1");
		test.done();
	}, function() {
		test.ok(false, "createNote() failed");
	});
};

exports.thereIsExactlyOneNoteAfterOneNoteIsCreated = function(test) {
	var dao = this.dao;
	var fields = {
		title: "title 1", 
		description: "description 1"
	};
	dao.createNote(fields, function(note) {
		dao.getAllNotes(function(notes) {
			test.equal(notes.length, 1);

			dao.countNotes(function(count) {
				test.equal(count, 1);
				test.done();
			}, function() {
				test.ok(false, "countNotes() failed");
			});
		}, function() {
			test.ok(false, "getAllNotes() failed");
		});
	}, function() {
		test.ok(false, "createNote() failed");
	});	
};

exports.canGetNoteById = function(test) {
	var dao = this.dao;
	var fields = {
		title: "title 1", 
		description: "description 1"
	};
	dao.createNote(fields, function(note) {
		var noteId = note.id;
		dao.getNote(noteId, function(note) {
			test.equal(note.id, 1);
			test.equal(note.title, "title 1");
			test.equal(note.description, "description 1");
			test.done();
		}, function(error) {
			test.ok(false, "getNote() failed");
		});		
	}, function() {
		test.ok(false, "createNote() failed");
	});	
};

exports.getNoteReturnsNullWhenThereIsNoSuchNote = function(test) {
	var dao = this.dao;
	dao.getNote(123, function(note) {
		test.equal(note, null);
		test.done();
	}, function() {
		test.ok(false, "getNote() failed");
	});
};

exports.canUpdateNote = function(test) {
	var dao = this.dao;
	var fields = {
		title: "title 1", 
		description: "description 1"
	};
	dao.createNote(fields, function(note) {
		var noteId = note.id;
		dao.updateNote(noteId, {title:"t", description: "d"}, function(note) {
			test.equal(note.id, noteId);
			test.equal(note.title, "t");
			test.equal(note.description, "d");
			test.done();
		}, function() {
			test.ok(false, "updateNote() failed");
		});
	}, function() {
		test.ok(false, "createNote() failed");
	});
};

exports.cantUpdateNoteThatDoesNotExist = function(test) {
	var dao = this.dao;
	dao.updateNote(123, {title:"t", description: "d"}, function(note) {
		test.ok(false, "should never get here");
	}, function(e) {
		console.log(e);
		test.done();
	});
};
