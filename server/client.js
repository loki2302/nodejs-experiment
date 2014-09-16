var request = require("request");
var async = require("async");

function NotepadClient(apiUrl) {
	this.apiUrl = apiUrl;
};

NotepadClient.prototype.makeUrl = function(relativePath) {
	return this.apiUrl + relativePath;
};

NotepadClient.prototype.post = function(relativePath, body, callback) {
	var url = this.makeUrl(relativePath);
	var params = {
		url: url,
		json: body
	};
	request.post(params, callback);
};

NotepadClient.prototype.get = function(relativePath, callback) {
	var url = this.makeUrl(relativePath);
	var params = {
		url: url,
		json: true
	};
	request.get(params, callback);
};

NotepadClient.prototype.delete = function(relativePath, callback) {
	var url = this.makeUrl(relativePath);
	var params = {
		url: url,
		json: true
	};
	request.del(params, callback);
};

NotepadClient.prototype.createNote = function(note, callback) {
	this.post("/notes/", note, callback);
};

NotepadClient.prototype.getAllNotes = function(callback) {
	this.get("/notes/", callback);
};

NotepadClient.prototype.deleteNote = function(noteId, callback) {
	this.delete("/notes/" + noteId, callback);
};

NotepadClient.prototype.updateNote = function(note, callback) {
	this.post("/notes/" + note.id, note, callback);
};

NotepadClient.prototype.createCategory = function(category, callback) {
	this.post("/categories/", category, callback);
};

NotepadClient.prototype.createCategories = function(categoriesWithTags, callback) {
	var self = this;
	var tasks = categoriesWithTags.reduce(function(memo, item) {		
		memo[item.tag] = function(callback) {
			self.createCategory(item.category, function(error, response, body) {
				callback(error, {
					response: response,
					body: body
				})
			});
		};
		return memo;
	}, {});

	async.series(tasks, callback);
};

NotepadClient.prototype.getAllCategories = function(callback) {
	this.get("/categories/", callback);
};

NotepadClient.prototype.getCategoriesWithNameStartingWith = function(namePattern, callback) {
	var url = this.makeUrl("/categories/");
	var params = {
		url: url,
		qs: {
			nameStartsWith: namePattern
		},
		json: true
	};
	request.get(params, callback);
};

NotepadClient.prototype.deleteCategory = function(categoryId, callback) {
	this.delete("/categories/" + categoryId, callback);
};

NotepadClient.prototype.updateCategory = function(category, callback) {
	this.post("/categories/" + category.id, category, callback);
};

module.exports = NotepadClient;
