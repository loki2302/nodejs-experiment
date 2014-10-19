var Sequelize = require("sequelize");
var Q = require("q");

exports.validationTests = {
	setUp: function(callback) {
		this.sequelize = new Sequelize('database', 'username', 'password', {
			dialect: 'sqlite',
			storage: 'my.db'
		});

		this.Note = this.sequelize.define('Note', {
			title: {
				type: Sequelize.STRING,
				validate: {
					notEmpty: {
						// validation message override
						msg: "title should not be empty"
					}
				}
			},
			content: { 
				type: Sequelize.TEXT,
				validate: {
					// default validation message
					notEmpty: true
				}
			}
		});

		this.sequelize.sync().success(function() {
			callback();
		}).error(function(e) {			
			throw e;
		});
	},

	tearDown: function(callback) {
		this.sequelize.drop().success(function() {
			callback()
		}).error(function(e) {
			throw e;
		});
	},

	dummy: function(test) {
		this.Note.create({ title: "", content: "" }).success(function(note) {
			test.ok(false, "should never get here");
		}).error(function(e) {
			test.ok(e instanceof Sequelize.ValidationError);

			var errorMap = {};
			e.errors.forEach(function(error) {
				errorMap[error.path] = error.message;
			});

			test.ok("title" in errorMap);
			test.equal(errorMap.title, "title should not be empty");
			test.ok("content" in errorMap);
			test.done();
		});		
	}
};
