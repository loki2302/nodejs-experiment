var Sequelize = require("sequelize");

var sequelize = new Sequelize("", "", "", {
	dialect: "sqlite",
	storage: "db"
});

var Note = sequelize.define("Note", {
	content: {
		type: Sequelize.TEXT,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: "Note content should not be empty"
			}
		}
	}
});

var Category = sequelize.define("Category", {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: {
				msg: "Category name should not be empty"
			}
		}
	}
});

Note.hasMany(Category);
Category.hasMany(Note);

module.exports.Note = Note;
module.exports.Category = Category;
module.exports.sequelize = sequelize;

module.exports.initialize = function(callback) {
	sequelize.sync().done(callback);
};

module.exports.reset = function(callback) {
	sequelize.drop().done(function() {
		sequelize.sync().done(callback);
	});
};
