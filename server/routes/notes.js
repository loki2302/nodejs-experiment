var Q = require("q");

var ValidationError = function(fields) {
	this.fields = fields;
};
ValidationError.prototype.name = "ValidationError";
ValidationError.prototype.message = "Something was not valid";

var FailedToFindAllCategoriesError = function() {};
FailedToFindAllCategoriesError.prototype.name = "FailedToFindAllCategoriesError";
FailedToFindAllCategoriesError.prototype.message = "Failed to find all categories";

exports.addRoutes = function(app, models) {
	function createNote(tx, note) {
		var deferred = Q.defer();

		models.Note.create({
			content: note.content
		}, {
			transaction: tx
		}).success(function(note) {
			deferred.resolve(note);
		}).error(function(error) {
			// it's assumed that error is always a validation error
			deferred.reject(new ValidationError(error));
		});

		return deferred.promise;	
	};

	function setNoteCategories(tx, note, categories) {
		var deferred = Q.defer();
		
		note.setCategories(categories, {
			transaction: tx
		}).success(function() {			
			deferred.resolve();
		}).error(function(error) {
			deferred.reject(error);
		});

		return deferred.promise;
	};

	function getNoteWithCategories(tx, noteId) {
		var deferred = Q.defer();

		models.Note.find({
			where: { id: noteId },
			include: [ models.Category ]
		}, {
			transaction: tx
		}).success(function(note) {
			console.log("xxx");
			deferred.resolve(note);
		}).error(function(error) {
			deferred.reject(error);
		});

		return deferred.promise;
	};

	function findCategoriesByCategoryIds(tx, categoryIds) {
		var deferred = Q.defer();

		models.Category.findAll({
			where: {
				id: { in: categoryIds }
			}
		}, {
			transaction: tx
		}).success(function(categories) {
			if(categories.length !== categoryIds.length) {
				deferred.reject(new FailedToFindAllCategoriesError());
			}

			deferred.resolve(categories);
		}).error(function(error) {
			deferred.reject(error);
		});

		return deferred.promise;
	};

	app.get("/api/notes/", function(req, res, next) {
		models.Note.findAll().success(function(notes) {
			res.status(200).send(notes);
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
			createNote(tx, {
				content: body.content
			}).then(function(note) {
				var categories = body.categories || [];				
				var categoryIds = categories.map(function(category) { 
					return category.id; 
				});

				return findCategoriesByCategoryIds(tx, categoryIds).then(function(categories) {
					return setNoteCategories(tx, note, categories);
				}).then(function() {
					return note.id;
				});
			}).then(function(noteId) {
				return getNoteWithCategories(tx, noteId);
			}).then(function(noteWithCategories) {
				return tx.commit().success(function() {					
					res.status(201).send(noteWithCategories);
				});
			}).then(null, function(error) {
				return tx.rollback().success(function() {
					if(error instanceof ValidationError) {
						res.status(400).send(error.fields);
					} else if(error instanceof FailedToFindAllCategoriesError) {
						res.status(400).send({
							message: error.message
						});
					} else if(error instanceof Error) {
						res.status(500).send({
							message: e.message
						});
					} else {
						res.status(500).send({
							message: "Unexpected error"
						});
					}
				}).error(function() {
					res.status(500).send({
						message: "Error"
					});
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
};