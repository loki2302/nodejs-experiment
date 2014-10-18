var async = require("async");
var validator = require("validator");
var DAO = require("./dao.js");
var Responses = require("./responses.js");

exports.addRoutes = function(app, dao, models) {
	app.use("/api", function(req, res, next) {
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
		var id = validator.isInt(note_id) ? validator.toInt(note_id) : null;
		if(!id) {
			next(new Responses.NotFoundError("Note", note_id));
		} else {
			dao.getNoteWithCategories(req.tx, id, function(error, result) {
				if(!error) {
					req.note = result;
					next();
				} else if(error instanceof DAO.NoteNotFoundError) {
					next(new Responses.NotFoundError("Note", id));
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
				res.result = new Responses.NoteCollectionResult(200, result);
				next();
			}
		});
	});	

	app.get("/api/notes/:note_id", function(req, res, next) {		
		res.result = new Responses.NoteResult(200, req.note);
		next();
	});

	app.delete("/api/notes/:note_id", function(req, res, next) {		
		var note = req.note;		
		note.destroy({
			transaction: req.tx
		}).success(function() {
			res.result = new Responses.MessageResult(200, "Deleted");
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
				res.result = new Responses.NoteResult(201, result);
				next();
			} else if(error instanceof DAO.ValidationError) {						
				next(new Responses.ValidationError(error.fields));
			} else if(error instanceof DAO.FailedToFindAllCategoriesError) {
				next(new Responses.BadRequestError(error.message));
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
				res.result = new Responses.NoteResult(200, result);
				next();
			} else if(error instanceof DAO.NoteNotFoundError) {
				next(new Responses.NotFoundError("Note", id));
			} else if(error instanceof DAO.FailedToFindAllCategoriesError) {
				next(new Responses.BadRequestError(error.message));
			} else if(error instanceof DAO.ValidationError) {
				next(new Responses.ValidationError(error.fields));
			} else {
				next(error);
			}			
		});		
	});

	app.param("category_id", function(req, res, next, category_id) {
		var id = validator.isInt(category_id) ? validator.toInt(category_id) : null;
		if(!id) {			
			next(new Responses.NotFoundError("Category", category_id));
			return;
		}

		models.Category.find({ 
			where: {id: id}
		}, { 
			transaction: req.tx 
		}).success(function(category) {
			if(!category) {
				next(new Responses.NotFoundError("Category", category_id));
				return;
			}

			req.category = category;
			next();
		}).error(function(error) {
			next(error);
		});		
	});

	app.get("/api/categories/", function(req, res, next) {
		var criteria = {};
		var nameStartsWith = req.query.nameStartsWith;
		if(nameStartsWith) {
			var lowercaseNameStartsWith = nameStartsWith.toLowerCase();
			criteria = {
				where: ["lower(name) like ?", lowercaseNameStartsWith + '%']
			};
		}

		models.Category.findAll(criteria, { 
			transaction: req.tx 
		}).success(function(categories) {
			res.result = new Responses.CategoryCollectionResult(200, categories);
			next();
		}).error(function(error) {
			next(error);
		});
	});

	app.get("/api/categories/:category_id", function(req, res, next) {
		res.result = new Responses.CategoryResult(200, req.category);
		next();
	});

	app.post("/api/categories/", function(req, res, next) {
		var body = req.body;
		var categoryName = body.name;
		models.Category.find({
			where: {
				name: categoryName
			}
		}, { 
			transaction: req.tx 
		}).success(function(category) {
			if(category) {
				next(new Responses.ConflictError("Category " + categoryName + " already exists"));
				return;
			}

			models.Category.create({ 
				name: body.name 
			}, { 
				transaction: req.tx 
			}).success(function(category) {
				res.result = new Responses.CategoryResult(201, category);
				next();
			}).error(function(error) {
				next(new Responses.ValidationError(error));
			});
		}).error(function(error) {
			next(error);
		});		
	});

	app.delete("/api/categories/:category_id", function(req, res, next) {
		var category = req.category;
		category.destroy({ 
			transaction: req.tx 
		}).success(function() {
			res.result = new Responses.MessageResult(200, "Deleted");
			next();
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/api/categories/:category_id", function(req, res, next) {
		var category = req.category;

		var categoryName = req.body.name;
		models.Category.find({
			where: {
				name: categoryName
			}
		}, { 
			transaction: req.tx 
		}).success(function(existingCategoryWithDesiredName) {
			if(existingCategoryWithDesiredName && existingCategoryWithDesiredName.id !== category.id) {
				next(new Responses.ConflictError("Category " + category.id + " already exists"));
				return;
			}

			category.name = categoryName;
			category.save({ 
				transaction: req.tx 
			}).success(function(category) {
				res.result = new Responses.CategoryResult(200, category);
				next();
			}).error(function(error) {
				next(new Responses.ValidationError(error));
			});
		});
	});

	app.use("/api", function(req, res, next) {
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

	app.use("/api", function(error, req, res, next) {
		console.log("TRANSACTION ROLLBACKER: %s", error);
		var tx = req.tx;
		tx.rollback().success(function() {
			next(error);
		}).error(function() {
			next(error);
		});
	});	

	app.use("/api", function(error, req, res, next) {
		console.log("ERROR RENDERER: [%s] %j", error.name, error);
		if(typeof error.render === "function") {
			error.render(res);
		} else {
			next(error);
		}
	});

	app.use("/api", function(req, res, next) {
		console.log("RESULT RENDERER");
		res.result.render(res);
		next();
	});	
};
