var Q = require("q");
var Sequelize = require("sequelize");

var sequelize = new Sequelize("", "", "", {
	dialect: "sqlite",
	storage: "db"
});

var Note = sequelize.define("Note", {
	content: {
		type: Sequelize.TEXT,
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

module.exports.initialize = function() {
	var deferred = Q.defer();

	sequelize.sync().success(function() {
		deferred.resolve();
	}).error(function(error) {
		deferred.reject(error);
	});

	return deferred.promise;
};

module.exports.reset = function() {
	var deferred = Q.defer();

	sequelize.drop().done(function() {
		sequelize.sync().success(function() {
			deferred.resolve();
		}).error(function(error) {
			deferred.reject(error);
		});
	});

	return deferred.promise;	
};
