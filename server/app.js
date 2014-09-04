var express = require("express");
var bodyParser = require("body-parser");

module.exports = function(models) {
	var app = express();
	app.use(express.static(__dirname + "/../client/build/"));
	app.use(bodyParser.json());

	app.get("/notes/", function(req, res, next) {
		models.Note.findAll().success(function(notes) {
			res.status(200).send(notes);
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/notes/", function(req, res, next) {
		var body = req.body;
		models.Note.create({ content: body.content }).success(function(note) {
			res.status(201).send(note);
		}).error(function(error) {			
			res.status(400).send(error);
		});
	});

	app.delete("/notes/:id", function(req, res, next) {
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

	app.get("/categories/", function(req, res, next) {
		models.Category.findAll().success(function(categories) {
			res.status(200).send(categories);
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/categories/", function(req, res, next) {
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

	app.delete("/categories/:id", function(req, res, next) {
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

	return app;
};
