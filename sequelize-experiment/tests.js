var DAO = require("./dao.js").DAO;
var Sequelize = require("sequelize");

exports.oneToManyTests = {

	setUp: function(callback) {
		this.sequelize = new Sequelize('database', 'username', 'password', {
			dialect: 'sqlite',
			storage: 'my.db'
		});

		this.Note = this.sequelize.define('Note', {
			content: Sequelize.STRING
		});

		this.Category = this.sequelize.define('Category', {
			name: Sequelize.STRING
		});

		this.Category.hasMany(this.Note);
		this.Note.belongsTo(this.Category);

		this.sequelize.sync().success(function() {
			callback();
		}).error(function(e) {
			throw e;
		});
	},

	tearDown: function(callback) {
		this.sequelize.drop().success(function() {
			callback()
		}).error(function(e) {
			throw e;
		});
	},

	dummy: function(test) {
		var Q = require("q");

		var self = this;
		function createCategory(name) {
			var deferred = Q.defer();

			self.Category.create({ name: name }).success(function(category) {
				deferred.resolve(category);
			}).error(function(e) {
				deferred.reject(e);
			});

			return deferred.promise;
		}

		function createNote(categoryId, content) {
			var deferred = Q.defer();

			self.Note.create({ content: content, CategoryId: categoryId }).success(function(note) {
				deferred.resolve(note);
			}).error(function(e) {
				deferred.reject(e);
			});

			return deferred.promise;
		}

		function getNoteWithCategory(noteId) {
			var deferred = Q.defer();

			var options = { 
				where: { id: noteId }, 
				include: [ self.Category ]
			};
			self.Note.find(options).success(function(note) {
				deferred.resolve(note);
			}).error(function(e) {
				deferred.reject(e);
			});

			return deferred.promise;
		}

		createCategory("js")
		.then(function(jsCategory) {
			return createNote(jsCategory.id, "hello");
		})
		.then(function(note) {
			var noteId = note.id;
			return getNoteWithCategory(noteId);
		})
		.then(function(note) {
			console.log(JSON.stringify(note));
			test.done();
		});
	}
};

exports.daoTests = {
	setUp: function(callback) {
		this.dao = new DAO();
		this.dao.initialize(function() {
			callback();
		}, function() {
			throw "initialize() failed";
		});
	},

	tearDown: function(callback) {
		this.dao.drop(function() {
			callback();
		}, function() {
			throw "drop() failed";
		});
	},

	thereAreNoNotesByDefault: function(test) {
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
	},

	canCreateNote: function(test) {
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
	},

	thereIsExactlyOneNoteAfterOneNoteIsCreated: function(test) {
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
	},

	canGetNoteById: function(test) {
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
	},

	getNoteReturnsNullWhenThereIsNoSuchNote: function(test) {
		var dao = this.dao;
		dao.getNote(123, function(note) {
			test.equal(note, null);
			test.done();
		}, function() {
			test.ok(false, "getNote() failed");
		});
	},

	canUpdateNote: function(test) {
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
	},

	cantUpdateNoteThatDoesNotExist: function(test) {
		var dao = this.dao;
		dao.updateNote(123, {title:"t", description: "d"}, function(note) {
			test.ok(false, "should never get here");
		}, function(e) {		
			test.done();
		});
	},

	canDeleteNote: function(test) {
		var dao = this.dao;
		var fields = {
			title: "title 1", 
			description: "description 1"
		};
		dao.createNote(fields, function(note) {
			var noteId = note.id;		
			dao.deleteNote(note, function() {			
				dao.countNotes(function(count) {
					test.equal(count, 0);
					test.done();
				}, function(e) {
					test.ok(false, "countNotes() failed");
				});
			}, function(e) {
				test.ok(false, "deleteNote() failed");
			});
		}, function() {
			test.ok(false, "createNote() failed");
		});
	},

	cantDeleteNoteThatDoesNotExist: function(test) {
		var dao = this.dao;
		dao.deleteNote(123, function() {		
			test.ok(false, "should never get here");
		}, function(e) {
			test.done();
		});
	}
};
