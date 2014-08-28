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
		test.done();
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
			test.done();
		}, function() {
			test.ok(false, "getAllNotes() failed");
		});
	}, function() {
		test.ok(false, "createNote() failed");
	});	
};
