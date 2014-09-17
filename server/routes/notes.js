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

exports.addRoutes = function(app, dao, models) {
	app.get("/api/notes/", function(req, res, next) {
		models.Note.findAll({			
			include: [ models.Category ]
		}).success(function(notes) {
			res.status(200).send(notes);
		}).error(next);
	});

	app.get("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		models.Note.find({
			where: { id: id	},
			include: [ models.Category ]
		}).success(function(note) {
			if(!note) {
				sendNoteNotFoundError(res, id);
				return;
			}

			res.status(200).send(note);
		}).error(next);
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
						res.status(201).send(noteWithCategories);
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

	app.delete("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		models.Note.find(id).success(function(note) {
			if(!note) {
				sendNoteNotFoundError(res, id);
				return;
			}

			note.destroy().success(function() {
				res.status(200).send({
					message: "Deleted"
				});
			}).error(next);
		}).error(next);
	});

	app.post("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		var sequelize = models.sequelize;
		sequelize.transaction({
			isolationLevel: "READ UNCOMMITTED"
		}, function(tx) {
			async.waterfall([
				dao.getNoteWithCategories.bind(dao, tx, id),
				function(note, callback) {
					note.content = req.body.content;
					dao.saveNote(tx, note, callback);
				},
				function(noteWithCategories, callback) {
					tx.commit().success(function() {
						res.status(200).send(noteWithCategories);
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
