var Sequelize = require("sequelize");
var async = require("async");
var validator = require("validator");
var Responses = require("./responses.js");

exports.addRoutes = function(app, models) {
	var Note = models.Note;
	var Category = models.Category;

	app.use("/api", function(req, res, next) {
		console.log("TRANSACTION STARTER");
		
		var sequelize = models.sequelize;
		sequelize.transaction({
			isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
		}).then(function(transaction) {
			console.log("TRANSACTION STARTED");
			req.tx = transaction;
			next();
		});
	});

	app.param("note_id", function(req, res, next, note_id) {
		var id = validator.isInt(note_id) ? validator.toInt(note_id) : null;
		if(!id) {			
			next(new Responses.NotFoundError("Note", note_id));
			return;
		}

		Note.find({ 
			where: { id: id },
			include: [ Category ]
		}, { 
			transaction: req.tx 
		}).success(function(note) {
			if(!note) {
				next(new Responses.NotFoundError("Note", note_id));
				return;
			}

			req.note = note;
			next();
		}).error(function(error) {
			next(error);
		});		
	});

	app.get("/api/notes/", function(req, res, next) {
		Note.findAll({
			include: [ Category ], 
		}, {
			transaction: req.tx		
		}).success(function(notes) {
			res.result = new Responses.NoteCollectionResult(200, notes);
			next();
		}).error(function(error) {
			next(error);
		});
	});	

	app.get("/api/notes/:note_id", function(req, res, next) {		
		res.result = new Responses.NoteResult(200, req.note);
		next();
	});

	app.delete("/api/notes/:note_id", function(req, res, next) {		
		req.note.destroy({
			transaction: req.tx
		}).success(function() {
			res.result = new Responses.MessageResult(200, "Deleted");
			next();
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/api/notes/", function(req, res, next) {
		async.auto({
			categories: function(callback) {
				var categoryIds = (req.body.categories || []).map(function(category) { 
					return category.id; 
				});

				Category.findAll({
					where: {
						id: { in: categoryIds }
					}
				}, {
					transaction: req.tx				
				}).done(function(error, result) {
					if(error) {
						callback(error);
					} else if(result.length !== categoryIds.length) {
						callback(new Responses.BadRequestError("Failed to find all categories"));
					} else {
						callback(null, result);
					}
				});
			},
			note: function(callback) {
				Note.create({
					content: req.body.content
				}, {
					transaction: req.tx
				}).done(callback);
			},
			noteAfterCategoriesSet: ["note", "categories", function(callback, results) {
				var note = results.note;
				var categories = results.categories;
				note.setCategories(categories, { 
					transaction: req.tx 
				}).done(function(error, result) {
					callback(error, note);
				});
			}],
			reloadedNote: ["noteAfterCategoriesSet", function(callback, results) {
				var note = results.noteAfterCategoriesSet;
				Note.find({ 
					where: { id: note.id },
					include: [ Category ]
				}, { 
					transaction: req.tx 
				}).done(callback);
			}]
		}, function(error, result) {
			if(!error) {
				res.result = new Responses.NoteResult(201, result.reloadedNote);
				next();
			} else if(error instanceof Sequelize.ValidationError) {
				var errorMap = {};
				error.errors.forEach(function(e) {
					errorMap[e.path] = e.message;
				});

				next(new Responses.ValidationError(errorMap));			
			} else {
				next(error);			
			}
		});
	});

	app.post("/api/notes/:note_id", function(req, res, next) {	
		async.waterfall([
			function(callback) {
				var categoryIds = (req.body.categories || []).map(function(category) { 
					return category.id; 
				});

				Category.findAll({
					where: {
						id: { in: categoryIds }
					}
				}, {
					transaction: req.tx				
				}).done(function(error, result) {
					if(error) {
						callback(error);
					} else if(result.length !== categoryIds.length) {
						callback(new Responses.BadRequestError("Failed to find all categories"));
					} else {
						callback(null, result);
					}
				});
			},			
			function(categories, callback) {
				req.note.updateAttributes({
					content: req.body.content,
					Categories: categories
				}, {
					include: [ Category ],
					transaction: req.tx
				}).done(callback);
			}
		], function(error, result) {
			if(!error) {
				res.result = new Responses.NoteResult(200, result);
				next();			
			} else if(error instanceof Sequelize.ValidationError) {
				var errorMap = {};
				error.errors.forEach(function(e) {
					errorMap[e.path] = e.message;
				});

				next(new Responses.ValidationError(errorMap));
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

		Category.find({ 
			where: { id: id }
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

		Category.findAll(criteria, { 
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
		Category.find({
			where: {
				name: req.body.name
			}
		}, { 
			transaction: req.tx 
		}).success(function(category) {
			if(category) {
				next(new Responses.ConflictError("Category " + req.body.name + " already exists"));
				return;
			}

			Category.create({ 
				name: req.body.name 
			}, { 
				transaction: req.tx 
			}).success(function(category) {
				res.result = new Responses.CategoryResult(201, category);
				next();
			}).error(function(error) {
				if(error instanceof Sequelize.ValidationError) {
					var errorMap = {};
					error.errors.forEach(function(e) {
						errorMap[e.path] = e.message;
					});

					next(new Responses.ValidationError(errorMap));
					return;
				}

				next(error);
			});
		}).error(function(error) {
			next(error);
		});		
	});

	app.delete("/api/categories/:category_id", function(req, res, next) {		
		req.category.destroy({ 
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
		Category.find({
			where: {
				name: req.body.name
			}
		}, { 
			transaction: req.tx 
		}).success(function(existingCategoryWithDesiredName) {
			if(existingCategoryWithDesiredName && existingCategoryWithDesiredName.id !== category.id) {
				next(new Responses.ConflictError("Category " + category.id + " already exists"));
				return;
			}

			category.name = req.body.name;
			category.save({ 
				transaction: req.tx 
			}).success(function(category) {
				res.result = new Responses.CategoryResult(200, category);
				next();
			}).error(function(error) {
				if(error instanceof Sequelize.ValidationError) {
					var errorMap = {};
					error.errors.forEach(function(e) {
						errorMap[e.path] = e.message;
					});

					next(new Responses.ValidationError(errorMap));
					return;
				}

				next(error);
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
