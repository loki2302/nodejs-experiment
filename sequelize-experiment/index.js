var Sequelize = require("sequelize");

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
		console.log("all");
		console.log(notes);

		Note.create({ title: "title 1", description: "description 1"}).success(function(note) {
			console.log("note");
			console.log(note);
			console.log("note title");
			console.log("id=%d, title=%s", note.id, note.title);

			sequelize.drop().success(function() {
				console.log("drop() succeeded");
			}).error(function(error) {
				console.log("drop() failed");
			});
		});
	});	
}).error(function(error) {
	console.log("sync() failed");
});