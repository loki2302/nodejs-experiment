var async = require("async");
var DAO = require("../dao.js");

function sendNoteNotFoundError(res, noteId) {
	res.status(404).send({
		message: "Note " + noteId + " not found"
	});
}

function sendValidationError(res, validationError) {
	res.status(400).send(validationError.fields);
}

function sendNotes(res, notes) {
	res.status(200).send(notes);
}

function sendNote(res, note) {
	res.status(200).send(note);
}

function sendNoteCreated(res, note) {
	res.status(201).send(note);
}

function sendNoteDeleted(res) {
	res.status(200).send({
		message: "Deleted"
	});
}

exports.addRoutes = function(app, dao, models) {
	app.get("/api/notes/", function(req, res, next) {
		dao.getAllNotes(function(error, result) {
			if(error) {
				next(error);
				return;
			}

			sendNotes(res, result);
		});
	});

	app.get("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		dao.getNoteWithCategories(null, id, function(error, result) {
			if(!error) {
				sendNote(res, result);
				return;
			}

			if(error instanceof DAO.NoteNotFoundError) {
				sendNoteNotFoundError(res, id);
			} else {
				next(error);
			}
		});
	});

	app.delete("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		async.waterfall([
			function(callback) {
				dao.getNoteWithCategories(null, id, callback);
			},
			function(note, callback) {
				note.destroy().success(callback).error(callback);
			},
			function(callback) {
				sendNoteDeleted(res);
			}
		], function(error, result) {
			if(!error) {
				return;
			}

			if(error instanceof DAO.NoteNotFoundError) {
				sendNoteNotFoundError(res, id);
			} else {
				next(error);
			}
		});
	});

	app.post("/api/notes/", function(req, res, next) {
		var body = req.body;
		var sequelize = models.sequelize;
		sequelize.transaction({
			isolationLevel: "READ UNCOMMITTED"
		}, function(tx) {
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
				dao.getNoteWithCategories.bind(dao, tx),
				function(noteWithCategories, callback) {
					tx.commit().success(function() {
						sendNoteCreated(res, noteWithCategories);
						callback();
					}).error(callback);
				}
			], function(error, result) {
				if(!error) {
					return;
				}

				tx.rollback().success(function() {
					if(error instanceof DAO.ValidationError) {
						sendValidationError(res, error);
					} else if(error instanceof DAO.FailedToFindAllCategoriesError) {
						res.status(400).send({
							message: error.message
						});
					} else {
						next(error);
					}
				}).error(next);
			});			
		});
	});

	app.post("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		var sequelize = models.sequelize;
		sequelize.transaction({
			isolationLevel: "READ UNCOMMITTED"
		}, function(tx) {
			async.waterfall([
				function(callback) {
					async.series({
						note: function(callback) {
							dao.getNoteWithCategories(tx, id, callback);
						},
						categories: function(callback) {
							var categories = req.body.categories;
							if(!categories) {
								callback();
								return;
							}

							var categoryIds = categories.map(function(category) { 
								return category.id; 
							});
							dao.findCategoriesByCategoryIds(tx, categoryIds, callback);
						}
					}, callback);
				},
				function(noteAndCategories, callback) {
					var note = noteAndCategories.note;
					note.content = req.body.content;

					var categories = noteAndCategories.categories;
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
				},
				function(noteWithCategories, callback) {
					tx.commit().success(function() {
						sendNote(res, noteWithCategories);
						callback();
					}).error(callback);
				}
			], function(error, result) {
				if(!error) {
					return;
				}

				tx.rollback().success(function() {
					if(error instanceof DAO.NoteNotFoundError) {
						sendNoteNotFoundError(res, id);
					} else if(error instanceof DAO.FailedToFindAllCategoriesError) {
						res.status(400).send({
							message: error.message
						});
					} else if(error instanceof DAO.ValidationError) {
						sendValidationError(res, error);
					} else {
						next(error);
					}
				}).error(next);
			});
		});
	});
};
