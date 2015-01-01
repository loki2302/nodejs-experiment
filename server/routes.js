var Sequelize = require("sequelize");
var router = require('koa-router');

exports.addRoutes = function(app, models) {
	var sequelize = models.sequelize;
	var Note = models.Note;
	var Category = models.Category;

	app.use(function* (next) {
		function makeNoteDTO(note) {
			return {
				id: note.id,
				content: note.content,
				categories: note.Categories
			};
		};

		function makeNoteDTOs(notes) {
			return notes.map(makeNoteDTO);
		};

		function makeMessageDTO(message) {
			return { 'message': message };
		}

		function makeNotFoundDTO(entity, id) {
			return makeMessageDTO(entity + " " + id + " not found");
		};

		this.ok = function(message) {
			this.status = 200;
			this.body = makeMessageDTO(message);
		};

		this.okNoteCollection = function(notes) {
			this.status = 200;
			this.body = makeNoteDTOs(notes);
		};

		this.okCategoryCollection = function(categories) {
			this.status = 200;
			this.body = categories;
		};

		this.okNote = function(note) {
			this.status = 200;
			this.body = makeNoteDTO(note);
		};

		this.okCategory = function(category) {
			this.status = 200;
			this.body = category;
		};

		this.createdNote = function(note) {
			this.status = 201;
			this.body = makeNoteDTO(note);
		};

		this.createdCategory = function(category) {
			this.status = 201;
			this.body = category;
		};

		this.noteNotFound = function(id) {
			this.status = 404;
			this.body = makeNotFoundDTO('Note', id);
		};

		this.categoryNotFound = function(id) {
			this.status = 404;
			this.body = makeNotFoundDTO('Category', id);
		};

		this.badRequest = function(message) {
			this.status = 400;
			this.body = makeMessageDTO(message);
		};

		this.conflict = function(message) {
			this.status = 409;
			this.body = makeMessageDTO(message);
		};

		this.validationError = function(error) {
			var errorMap = {};
			error.errors.forEach(function(e) {
				errorMap[e.path] = e.message;
			});

			this.status = 400;
			this.body = errorMap;
		};

		yield next;
	});

	app.use(function* (next) {
    var tx = yield sequelize.transaction({
      isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    });

    this.tx = tx;
    
    try {
      yield next;

      try {
        yield tx.commit();
        console.log("operation succeeded, commit succeeded");
      } catch(commitException) {
        console.log("operation succeeded, commit failed: %s", commitException);
      }
    } catch(operationException) {
      try {
        yield tx.rollback();
        console.log("operation failed, rollback succeeded: %j", operationException);
      } catch(rollbackException) {
        console.log("operation failed, rollback failed: %s", rollbackException);
      }
    }
  });
  
  app.use(router(app));

	app.param("note_id", function* (noteId, next) {
		var note = yield Note.find({
			where: { id: noteId },
			include: [ Category ]
		}, {
			transaction: this.tx
		});

		if(!note) {
			this.noteNotFound(noteId);
			return;
		}

		this.note = note;		
		yield next;
	});

	app.get("/api/notes/", function* (next) {
		var notes = yield Note.findAll({
			include: [ Category ]
		}, { 
			transaction: this.tx 
		});

		this.okNoteCollection(notes);
	});	

	app.get("/api/notes/:note_id", function* (next) {
		this.okNote(this.note);
	});

	app.delete("/api/notes/:note_id", function* (next) {
		yield this.note.destroy({
			transaction: this.tx
		});

		this.ok('Deleted');
	});

	app.post('/api/notes/', function* (next) {
		var categoryIds = (this.request.body.categories || []).map(function(category) {
			return category.id; 
		});

		var categories = yield Category.findAll({
			where: {
				id: { in: categoryIds }
			}
		}, {
			transaction: this.tx
		});

		if(categories.length !== categoryIds.length) {
			this.badRequest("Failed to find all categories");
			return;
		}

		var note;
		try {
			note = yield Note.create({
				content: this.request.body.content
			}, {
				transaction: this.tx
			});

			yield note.setCategories(categories, {
				transaction: this.tx
			});
		} catch(e) {
			if(e instanceof Sequelize.ValidationError) {
				this.validationError(e);
				return;
			}

			throw e;
		}

		note = yield Note.find({
			where: { id: note.id },
			include: [ Category ]
		}, {
			transaction: this.tx
		});

		this.createdNote(note);
	});

	app.post('/api/notes/:note_id', function* (next) {
		this.note.content = this.request.body.content;
		try {
			yield this.note.save({
				transaction: this.tx
			});
		} catch(e) {
			if(e instanceof Sequelize.ValidationError) {
				this.validationError(e);
				return;
			}

			throw e;
		}

		var categoryIds = (this.request.body.categories || []).map(function(category) {
			return category.id; 
		});

		var categories = yield Category.findAll({
			where: {
				id: { in: categoryIds }
			}
		}, {
			transaction: this.tx
		});

		if(categories.length !== categoryIds.length) {
			this.badRequest("Failed to find all categories");
			return;
		}

		yield this.note.setCategories(categories, {
			transaction: this.tx
		});

		var note = yield Note.find({
			where: { id: this.note.id },
			include: [ Category ]
		}, {
			transaction: this.tx
		});

		this.okNote(note);
	});

	app.param("category_id", function* (categoryId, next) {
		var category = yield Category.find({
			where: { id: categoryId }
		}, {
			transaction: this.tx
		});

		if(!category) {
			this.categoryNotFound(categoryId);
			return;
		}

		this.category = category;
		yield next;
	});

	app.get('/api/categories/', function* (next) {
		var criteria = {};
		var nameStartsWith = this.request.query.nameStartsWith;
		if(nameStartsWith) {
			var lowercaseNameStartsWith = nameStartsWith.toLowerCase();
			criteria = {
				where: ["lower(name) like ?", lowercaseNameStartsWith + '%']
			};
		}

		var categories = yield Category.findAll(criteria, {
			transaction: this.tx
		});

		this.okCategoryCollection(categories);
	});

	app.get('/api/categories/:category_id', function* (next) {
		this.okCategory(this.category);
	});

	app.post('/api/categories/', function* (next) {
		var existingCategory = yield Category.find({
			where: { name: this.request.body.name }
		});
		if(existingCategory) {
			this.conflict('Category ' + this.request.body.name + ' already exists');
			return;
		}

		var category;
		try {
			category = yield Category.create({
				name: this.request.body.name
			});
		} catch(e) {
			if(e instanceof Sequelize.ValidationError) {
				this.validationError(e);
				return;
			}

			throw e;
		}

		this.createdCategory(category);
	});

	app.delete('/api/categories/:category_id', function* (next) {
		yield this.category.destroy({
			transaction: this.tx
		});

		this.ok('Deleted');
	});

	app.post('/api/categories/:category_id', function* (next) {
		var existingCategory = yield Category.find({
			where: { name: this.request.body.name }
		});

		if(existingCategory && existingCategory.id !== this.category.id) {
			this.conflict('Category ' + this.request.body.name + ' already exists');
			return;
		}

		this.category.name = this.request.body.name;

		try {
			yield this.category.save({
				transaction: this.tx
			});
		} catch(e) {
			if(e instanceof Sequelize.ValidationError) {
				this.validationError(e);
				return;
			}

			throw e;
		}

		this.okCategory(this.category);
	});
};
