var Q = require("q");

var ValidationError = function(fields) {
	this.fields = fields;
};
ValidationError.prototype.name = "ValidationError";
ValidationError.prototype.message = "Something was not valid";

var FailedToFindAllCategoriesError = function() {};
FailedToFindAllCategoriesError.prototype.name = "FailedToFindAllCategoriesError";
FailedToFindAllCategoriesError.prototype.message = "Failed to find all categories";

var DAO = function(models) {
	this.models = models;
};

DAO.prototype.createNote = function(tx, note) {
	var deferred = Q.defer();

	this.models.Note.create({
		content: note.content
	}, {
		transaction: tx
	}).success(function(note) {
		deferred.resolve(note);
	}).error(function(error) {
		// it's assumed that if error is not instanceof Error,
		// it's a validation error

		if(error instanceof Error) {
			deferred.reject(error);
			return;
		}

		deferred.reject(new ValidationError(error));
	});

	return deferred.promise;	
};

DAO.prototype.setNoteCategories = function(tx, note, categories) {
	var deferred = Q.defer();
	
	note.setCategories(categories, {
		transaction: tx
	}).success(function() {			
		deferred.resolve();
	}).error(function(error) {
		deferred.reject(error);
	});

	return deferred.promise;
};

DAO.prototype.getNoteWithCategories = function(tx, noteId) {
	var deferred = Q.defer();

	this.models.Note.find({
		where: { id: noteId },
		include: [ this.models.Category ]
	}, {
		transaction: tx
	}).success(function(note) {		
		deferred.resolve(note);
	}).error(function(error) {
		deferred.reject(error);
	});

	return deferred.promise;
};

DAO.prototype.findCategoriesByCategoryIds = function(tx, categoryIds) {
	var deferred = Q.defer();

	this.models.Category.findAll({
		where: {
			id: { in: categoryIds }
		}
	}, {
		transaction: tx
	}).success(function(categories) {
		if(categories.length !== categoryIds.length) {
			deferred.reject(new FailedToFindAllCategoriesError());
		}

		deferred.resolve(categories);
	}).error(function(error) {
		deferred.reject(error);
	});

	return deferred.promise;
};

module.exports.DAO = DAO;
module.exports.ValidationError = ValidationError;
module.exports.FailedToFindAllCategoriesError = FailedToFindAllCategoriesError;
