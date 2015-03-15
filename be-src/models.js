var Sequelize = require("sequelize");

module.exports = function() {
	var sequelize = new Sequelize('sqlite://my.db');

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

	Note.belongsToMany(Category);
	Category.belongsToMany(Note, { constraints: false });

	return {
		sequelize: sequelize,
		initialize: function(callback) {
			sequelize.sync().done(callback);
		},
		reset: function(callback) {
			sequelize.drop().done(function() {
				sequelize.sync().done(callback);
			});
		}
	};
};