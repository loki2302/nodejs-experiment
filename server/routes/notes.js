exports.addRoutes = function(app, models) {
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
			models.Note.create({ 
				content: body.content 
			}, {
				transaction: tx
			}).success(function(note) {
				if(!body.categories) {
					tx.commit().success(function() {
						res.status(201).send(note);
					}).error(function(error) {
						res.status(500).send(error);
					});					
					return;
				}
				
				var categories = body.categories;
				var categoryIds = categories.map(function(category) { 
					return category.id; 
				});
				models.Category.findAll({
					where: {
						id: {
							in: categoryIds
						}
					}
				}, {
					transaction: tx
				}).success(function(categories) {
					if(categories.length !== categoryIds.length) {
						tx.rollback().success(function() {
							res.status(400).send({
								message: "Didn't find at least one category"
							});
						}).error(function(error) {
							res.status(500).send(error);
						});						
						return;
					}
					
					note.setCategories(categories, {
						transaction: tx
					}).success(function() {
						models.Note.find({
							where: { id: note.id },
							include: [ models.Category ]
						}, {
							transaction: tx
						}).success(function(note) {
							tx.commit().success(function() {
								res.status(201).send(note);
							}).error(function(error) {
								res.status(500).send(error);
							});
						}).error(function(error) {
							tx.rollback().success(function() {
								res.status(400).send(error);
							}).error(function(error) {
								res.status(500).send(error);
							});
						});
					}).error(function(error) {
						tx.rollback().success(function() {
							res.status(400).send(error);
						}).error(function(error) {
							res.status(500).send(error);
						});
					});				
				}).error(function(error) {
					tx.rollback().success(function() {
						res.status(400).send(error);
					}).error(function(error) {
						res.status(500).send(error);
					});
				});						
			}).error(function(error) {			
				tx.rollback().success(function() {
					res.status(400).send(error);
				}).error(function(error) {
					res.status(500).send(error);
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