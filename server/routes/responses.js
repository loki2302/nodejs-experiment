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

function NoteNotFoundError(id) {
	this.id = id;
};
NoteNotFoundError.prototype.name = "NoteNotFoundError";
NoteNotFoundError.prototype.render = function(res) {
	res.status(404).send({ "message": "Note " + this.id + " not found" });
};
module.exports.NoteNotFoundError = NoteNotFoundError;

function ValidationError(fields) {
	this.fields = fields;
};
ValidationError.prototype.name = "ValidationError";
ValidationError.prototype.render = function(res) {
	res.status(400).send(this.fields);
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
