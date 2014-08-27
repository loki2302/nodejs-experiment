var Sequelize = require("sequelize");

exports.basicUseCase = function(test) {
	var sequelize = new Sequelize('database', 'username', 'password', {
	  dialect: 'sqlite',
	  storage: 'my.db'
	});

	var Note = sequelize.define('Note', {
	  title: Sequelize.STRING,
	  description: Sequelize.TEXT
	});

	sequelize.sync().success(function() {
		Note.all().success(function(notes) {
			test.equal(notes.length, 0);

			Note.create({ title: "title 1", description: "description 1"}).success(function(note) {
				test.equal(note.id, 1);
				test.equal(note.title, "title 1");
				test.equal(note.description, "description 1");

				sequelize.drop().success(function() {
					test.done();
				}).error(function(error) {
					test.ok(false, "drop() failed");
					test.done();
				});
			}).error(function(error) {
				test.ok(false, "Note.create() failed");
				test.done();
			});
		}).error(function(error) {
			test.ok(false, "Note.all() failed");
			test.done();
		});	
	}).error(function(error) {		
		test.ok(false, "sync() failed");
		test.done();
	});
};