var sleep = require("sleep");

exports.addRoutes = function(app, models, config) {
	app.get("/api/notes/", function(req, res, next) {
		if(config && config.delay) {
			sleep.sleep(config.delay);
		}

		models.Note.findAll().success(function(notes) {
			res.status(200).send(notes);
		}).error(function(error) {
			next(error);
		});
	});

	app.post("/api/notes/", function(req, res, next) {
		if(config && config.delay) {
			sleep.sleep(config.delay);
		}

		var body = req.body;
		models.Note.create({ content: body.content }).success(function(note) {
			res.status(201).send(note);
		}).error(function(error) {			
			res.status(400).send(error);
		});
	});

	app.delete("/api/notes/:id", function(req, res, next) {
		if(config && config.delay) {
			sleep.sleep(config.delay);
		}

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
		if(config && config.delay) {
			sleep.sleep(config.delay);
		}
		
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