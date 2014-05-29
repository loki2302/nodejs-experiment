exports.Note = function(values) {
	this.id = values.id || null;
	this.title = values.title || "";
	this.text = values.text || "";
};
