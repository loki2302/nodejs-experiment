var rp = require('request-promise');

function NotepadClient(apiUrl) {
  this.apiUrl = apiUrl;
};

NotepadClient.prototype.makeUrl = function(relativePath) {
  return this.apiUrl + relativePath;
};

NotepadClient.prototype.get = function(relativePath) {
  var url = this.makeUrl(relativePath);
  return rp({
    method: 'GET',
    url: url,
    json: true,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.post = function(relativePath, body) {
  var url = this.makeUrl(relativePath);
  return rp({
    method: 'POST',
    url: url,
    json: true,
    body: body,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.delete = function(relativePath) {
  var url = this.makeUrl(relativePath);
  return rp({
    method: 'DELETE',
    url: url,
    json: true,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.getAllNotes = function() {
  return this.get("/notes/");
};

NotepadClient.prototype.createNote = function(note) {
  return this.post("/notes/", note);
};

NotepadClient.prototype.getNote = function(noteId) {
  return this.get("/notes/" + noteId);
};

NotepadClient.prototype.deleteNote = function(noteId) {
  return this.delete("/notes/" + noteId);
};

NotepadClient.prototype.updateNote = function(note) {
  return this.post("/notes/" + note.id, note);
};

NotepadClient.prototype.getAllCategories = function() {
  return this.get("/categories/");
};

NotepadClient.prototype.getCategoriesWithNamesStartingWith = function(namePattern) {
  var url = this.makeUrl("/categories/");
  return rp({
    method: 'GET',
    url: url,
    qs: {
      nameStartsWith: namePattern
    },
    json: true,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.createCategory = function(category) {
  return this.post("/categories/", category);
};

NotepadClient.prototype.getCategory = function(categoryId) {
  return this.get("/categories/" + categoryId);
};

NotepadClient.prototype.deleteCategory = function(categoryId) {
  return this.delete("/categories/" + categoryId);
};

NotepadClient.prototype.updateCategory = function(category) {
  return this.post("/categories/" + category.id, category);
};

module.exports = NotepadClient;
