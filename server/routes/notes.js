var async = require("async");
var DAO = require("../dao.js");
var validator = require("validator");

function makeNoteResult(status, note) {
	return function(res) {
		res.status(status).send(note);
	};
};

function makeNoteCollectionResult(status, noteCollection) {
	return function(res) {
		res.status(status).send(noteCollection);
	};
};

function makeMessageResult(status, message) {
	return function(res) {
		res.status(status).send({
			"message": message
		});
	};
};

function NoteNotFoundError(id) {
	this.id = id;
};
NoteNotFoundError.prototype.name = "NoteNotFoundError";
NoteNotFoundError.prototype.render = function(res) {
	res.status(404).send({ "message": "Note " + this.id + " not found" });
};

function ValidationError(fields) {
	this.fields = fields;
};
ValidationError.prototype.name = "ValidationError";
ValidationError.prototype.render = function(res) {
	res.status(400).send(this.fields);
};

function BadRequestError(message) {
	this.message = message;
};
BadRequestError.prototype.name = "BadRequestError";
BadRequestError.prototype.render = function(res) {
	res.status(400).send({ "message": this.message });	
};

function intIdOrNull(idString) {
	return validator.isInt(idString) ? validator.toInt(idString) : null;
};

exports.addRoutes = function(app, dao, models) {
	app.use("/api/notes", function(req, res, next) {
		console.log("TRANSACTION STARTER");
		var sequelize = models.sequelize;
		sequelize.transaction({
			isolationLevel: "READ UNCOMMITTED"
		}, function(tx) {
			req.tx = tx;
			console.log("TRANSACTION STARTED");
			next();
		});
	});

	app.param("note_id", function(req, res, next, note_id) {
		var id = intIdOrNull(note_id);
		if(!id) {
			next(new NoteNotFoundError(note_id));
		} else {
			dao.getNoteWithCategories(req.tx, id, function(error, result) {
				if(!error) {
					req.note = result;
					next();
				} else if(error instanceof DAO.NoteNotFoundError) {
					next(new NoteNotFoundError(id));
				} else {
					next(error);
				}
			});
		}
	});	

	app.get("/api/notes/", function(req, res, next) {
		dao.getAllNotes(function(error, result) {
			if(error) {
				next(error);
			} else {
				res.result = makeNoteCollectionResult(200, result);
				next();
			}
		});
	});	

	app.get("/api/notes/:note_id", function(req, res, next) {		
		res.result = makeNoteResult(200, req.note);
		next();
	});

	app.delete("/api/notes/:note_id", function(req, res, next) {		
		var note = req.note;		
		note.destroy({
			transaction: req.tx
		}).success(function() {
			res.result = makeMessageResult(200, "Deleted");
			next();
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/api/notes/", function(req, res, next) {
		var body = req.body;
		var sequelize = models.sequelize;
		var tx = req.tx;
		
		async.waterfall([
			dao.createNote.bind(dao, tx, {
				content: body.content
			}),
			function(note, callback) {
				var categories = body.categories || [];				
				var categoryIds = categories.map(function(category) { 
					return category.id; 
				});

				async.waterfall([
					dao.findCategoriesByCategoryIds.bind(dao, tx, categoryIds),
					dao.setNoteCategories.bind(dao, tx, note)
				], function(error, result) {
					callback(error, note.id);
				});					
			},
			dao.getNoteWithCategories.bind(dao, tx)
		], function(error, result) {
			if(!error) {
				res.result = makeNoteResult(201, result);
				next();
			} else if(error instanceof DAO.ValidationError) {						
				next(new ValidationError(error.fields));
			} else if(error instanceof DAO.FailedToFindAllCategoriesError) {
				next(new BadRequestError(error.message));
			} else {
				next(error);			
			}
		});
	});

	app.post("/api/notes/:note_id", function(req, res, next) {
		var note = req.note;
		var sequelize = models.sequelize;
		var tx = req.tx;
		
		async.waterfall([
			function(callback) {
				var categories = req.body.categories;
				if(!categories) {
					callback(null, null);
					return;
				}

				var categoryIds = categories.map(function(category) { 
					return category.id; 
				});
				dao.findCategoriesByCategoryIds(tx, categoryIds, callback);				
			},
			function(categories, callback) {
				note.content = req.body.content;					
				
				if(!categories) {
					callback(null, note);
					return;
				}

				dao.setNoteCategories(tx, note, categories, function(error) {
					callback(error, note);
				});
			},
			function(note, callback) {
				dao.saveNote(tx, note, callback);
			},
			function(note, callback) {
				dao.getNoteWithCategories(tx, note.id, callback);
			}
		], function(error, result) {
			if(!error) {
				res.result = makeNoteResult(200, result);
				next();
			} else if(error instanceof DAO.NoteNotFoundError) {
				next(new NoteNotFoundError(id));
			} else if(error instanceof DAO.FailedToFindAllCategoriesError) {
				next(new BadRequestError(error.message));
			} else if(error instanceof DAO.ValidationError) {
				next(new ValidationError(error.fields));
			} else {
				next(error);
			}			
		});		
	});

	app.use("/api/notes", function(req, res, next) {
		console.log("TRANSACTION COMMITER");
		var tx = req.tx;
		tx.commit().success(function() {
			console.log("COMMITTED SUCCESSFULLY");
			next();
		}).error(function() {
			console.log("COMMIT FAILED");
			next();
		});
	});

	app.use("/api/notes", function(error, req, res, next) {
		console.log("TRANSACTION ROLLBACKER: %s", error);
		var tx = req.tx;
		tx.rollback().success(function() {
			next(error);
		}).error(function() {
			next(error);
		});
	});	

	app.use("/api/notes", function(error, req, res, next) {
		console.log("ERROR RENDERER: [%s] %j", error.name, error);
		if(typeof error.render === "function") {
			error.render(res);
		} else {
			next(error);
		}
	});

	app.use("/api/notes", function(req, res, next) {
		console.log("RESULT RENDERER");
		res.result(res);
		next();
	});	
};
