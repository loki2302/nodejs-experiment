function NoteResult(status, note) {
	this.status = status;
	this.note = note;
};
NoteResult.prototype.render = function(res) {
	res.status(this.status).send(this.note);
};
module.exports.NoteResult = NoteResult;

function NoteCollectionResult(status, noteCollection) {
	this.status = status;
	this.noteCollection = noteCollection;
};
NoteCollectionResult.prototype.render = function(res) {
	res.status(this.status).send(this.noteCollection);
};
module.exports.NoteCollectionResult = NoteCollectionResult;

function MessageResult(status, message) {
	this.status = status;
	this.message = message;
};
MessageResult.prototype.render = function(res) {
	res.status(this.status).send({
		"message": this.message
	});
};
module.exports.MessageResult = MessageResult;

function NotFoundError(entity, id) {
	this.entity = entity;
	this.id = id;
};
NotFoundError.prototype.name = "NotFoundError";
NotFoundError.prototype.render = function(res) {
	res.status(404).send({ "message": this.entity + " " + this.id + " not found" });
};
module.exports.NotFoundError = NotFoundError;

function ValidationError(fields) {
	this.fields = fields;
};
ValidationError.prototype.name = "ValidationError";
ValidationError.prototype.render = function(res) {
	var errorMap = {};
	for(var field in this.fields) {
		var errorMessages = this.fields[field];
		var singleErrorMessage = errorMessages.join(". ");
		errorMap[field] = singleErrorMessage;
	}

	res.status(400).send(errorMap);
};
module.exports.ValidationError = ValidationError;

function BadRequestError(message) {
	this.message = message;
};
BadRequestError.prototype.name = "BadRequestError";
BadRequestError.prototype.render = function(res) {
	res.status(400).send({ "message": this.message });	
};
module.exports.BadRequestError = BadRequestError;

function CategoryResult(status, category) {
	this.status = status;
	this.category = category;
};
CategoryResult.prototype.render = function(res) {
	res.status(this.status).send(this.category);
};
module.exports.CategoryResult = CategoryResult;

function CategoryCollectionResult(status, categoryCollection) {
	this.status = status;
	this.categoryCollection = categoryCollection;
};
CategoryCollectionResult.prototype.render = function(res) {
	res.status(this.status).send(this.categoryCollection);
};
module.exports.CategoryCollectionResult = CategoryCollectionResult;

function ConflictError(message) {
	this.message = message;
};
ConflictError.prototype.name = "ConflictError";
ConflictError.prototype.render = function(res) {
	res.status(409).send({ "message": this.message });	
};
module.exports.ConflictError = ConflictError;
