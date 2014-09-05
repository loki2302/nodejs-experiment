exports.addRoutes = function(app, models, config) {
	app.get("/api/categories/", function(req, res, next) {
		if(config && config.delay) {
			sleep.sleep(config.delay);
		}

		models.Category.findAll().success(function(categories) {
			res.status(200).send(categories);
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/api/categories/", function(req, res, next) {
		if(config && config.delay) {
			sleep.sleep(config.delay);
		}

		var body = req.body;
		var categoryName = body.name;
		models.Category.find({
			where: {
				name: categoryName
			}
		}).success(function(category) {
			if(category) {
				res.status(409).send({
					message: "Category " + categoryName + " already exists"
				});
				return;
			}

			models.Category.create({ name: body.name }).success(function(category) {
				res.status(201).send(category);
			}).error(function(error) {
				res.status(400).send(error);
			});
		}).error(function(error) {
			next(error);
		});		
	});

	app.delete("/api/categories/:id", function(req, res, next) {
		if(config && config.delay) {
			sleep.sleep(config.delay);
		}

		var id = req.params.id;
		models.Category.find(id).success(function(category) {
			if(!category) {
				res.status(404).send({
					message: "Category " + id + " does not exist"
				});
				return;
			}

			category.destroy().success(function() {
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

	app.post("/api/categories/:id", function(req, res, next) {
		if(config && config.delay) {
			sleep.sleep(config.delay);
		}
		
		var id = req.params.id;
		models.Category.find(id).success(function(category) {
			if(!category) {
				res.status(404).send({
					message: "Category " + id + " does not exist"
				});
				return;
			}

			var categoryName = req.body.name;
			models.Category.find({
				where: {
					name: categoryName
				}
			}).success(function(existingCategoryWithDesiredName) {
				if(existingCategoryWithDesiredName && existingCategoryWithDesiredName.id !== id) {
					res.status(409).send({
						message: "Category " + categoryName + " already exists"
					});
					return;
				}

				category.name = categoryName;
				category.save().success(function(category) {
					res.status(200).send(category);
				}).error(function(error) {
					res.status(400).send(error);
				});
			});
		}).error(function(error) {
			next(error);
		});
	});
};