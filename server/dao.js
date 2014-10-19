var Sequelize = require("sequelize");
var async = require("async");

var ValidationError = function(fields) {
	this.fields = fields;
};
ValidationError.prototype.name = "ValidationError";
ValidationError.prototype.message = "Something was not valid";

var FailedToFindAllCategoriesError = function() {};
FailedToFindAllCategoriesError.prototype.name = "FailedToFindAllCategoriesError";
FailedToFindAllCategoriesError.prototype.message = "Failed to find all categories";

var NoteNotFoundError = function() {};
NoteNotFoundError.prototype.name = "NoteNotFoundError";

var DAO = function(models) {
	this.models = models;
};

DAO.prototype.getAllNotes = function(callback) {
	this.models.Note.findAll({		
		include: [ this.models.Category ]
	}).success(function(notes) {
		callback(null, notes);
	}).error(callback);
};

DAO.prototype.createNote = function(tx, note, callback) {
	console.log(note);
	this.models.Note.create({
		content: note.content
	}, {
		transaction: tx
	}).success(function(note) {		
		callback(null, note);
	}).error(function(error) {		
		console.log(error);
		if(error instanceof Sequelize.ValidationError) {
			var errorMap = {};
			error.errors.forEach(function(e) {
				errorMap[e.path] = e.message;
			});

			callback(new ValidationError(errorMap));
			return;
		}

		callback(error);
	});
};

DAO.prototype.saveNote = function(tx, note, callback) {
	note.save({
		transaction: tx
	}).success(function(note) {
		callback(null, note);
	}).error(function(error) {
		if(error instanceof Sequelize.ValidationError) {
			var errorMap = {};
			error.errors.forEach(function(e) {
				errorMap[e.path] = e.message;
			});

			callback(new ValidationError(errorMap));
			return;
		}

		callback(error);
	});
};

DAO.prototype.setNoteCategories = function(tx, note, categories, callback) {
	note.setCategories(categories, {
		transaction: tx
	}).success(function() {
		callback();
	}).error(function(error) {
		callback(error);
	});
};

DAO.prototype.getNoteWithCategories = function(tx, noteId, callback) {
	this.models.Note.find({
		where: { id: noteId },
		include: [ this.models.Category ]
	}, {
		transaction: tx
	}).success(function(note) {
		if(!note) {
			callback(new NoteNotFoundError());
			return;
		}

		callback(null, note);
	}).error(function(error) {
		callback(error);
	});
};

DAO.prototype.findCategoriesByCategoryIds = function(tx, categoryIds, callback) {
	this.models.Category.findAll({
		where: {
			id: { in: categoryIds }
		}
	}, {
		transaction: tx
	}).success(function(categories) {
		if(categories.length !== categoryIds.length) {
			callback(new FailedToFindAllCategoriesError());
			return;
		}

		callback(null, categories);
	}).error(function(error) {		
		callback(error);
	});
};

module.exports.DAO = DAO;
module.exports.ValidationError = ValidationError;
module.exports.FailedToFindAllCategoriesError = FailedToFindAllCategoriesError;
module.exports.NoteNotFoundError = NoteNotFoundError;
