var Q = require("q");
var async = require("async");
var DAO = require("../dao.js");

exports.addRoutes = function(app, dao, models) {
	app.get("/api/notes/", function(req, res, next) {
		models.Note.findAll({			
			include: [ models.Category ]
		}).success(function(notes) {
			res.status(200).send(notes);
		}).error(function(error) {
			next(error);
		});
	});

	app.get("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		models.Note.find({
			where: { id: id	},
			include: [ models.Category ]
		}).success(function(note) {
			if(!note) {
				res.status(404).send({
					message: "There's no note " + id
				});
				return;
			}

			res.status(200).send(note);
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/api/notes/", function(req, res, next) {
		var body = req.body;
		var sequelize = models.sequelize;
		sequelize.transaction({
			isolationLevel: "READ UNCOMMITTED"
		}, function(tx) {
			async.waterfall([
				function(callback) {
					dao.createNote(tx, {
						content: body.content
					}, callback);
				},
				function(note, callback) {
					var categories = body.categories || [];				
					var categoryIds = categories.map(function(category) { 
						return category.id; 
					});

					async.waterfall([
						function(callback) {
							dao.findCategoriesByCategoryIds(tx, categoryIds, callback);
						},
						function(categories, callback) {
							dao.setNoteCategories(tx, note, categories, callback);
						}
					], function(error, result) {
						callback(error, note.id);
					});					
				},
				function(noteId, callback) {
					dao.getNoteWithCategories(tx, noteId, callback);
				},
				function(noteWithCategories, callback) {
					tx.commit().success(function() {
						res.status(201).send(noteWithCategories);
						callback();
					}).error(function(error) {
						callback(error);
					});
				}
			], function(error, result) {
				if(!error) {
					return;
				}

				tx.rollback().success(function() {
					if(error instanceof DAO.ValidationError) {
						res.status(400).send(error.fields);
					} else if(error instanceof DAO.FailedToFindAllCategoriesError) {
						res.status(400).send({
							message: error.message
						});
					} else {
						next(error);
					}
				}).error(function(error) {
					next(error);
				});
			});			
		});
	});

	app.delete("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		models.Note.find(id).success(function(note) {
			if(!note) {
				res.status(404).send({
					message: "Note " + id + " does not exist"
				});
				return;
			}

			note.destroy().success(function() {
				res.status(200).send({
					message: "Deleted"
				});
			}).error(function(error) {
				next(error);
			});
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/api/notes/:id", function(req, res, next) {
		var id = req.params.id;
		var sequelize = models.sequelize;
		sequelize.transaction({
			isolationLevel: "READ UNCOMMITTED"
		}, function(tx) {
			models.Note.find(id).success(function(note) {
				if(!note) {
					res.status(404).send({
						message: "Note " + id + " does not exist"
					});
					return;
				}

				note.content = req.body.content;

				note.save().success(function(note) {
					res.status(200).send(note);
				}).error(function(error) {
					res.status(400).send(error);
				});
			}).error(function(error) {
				next(error);
			});
		});
	});
};