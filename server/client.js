var rp = require('request-promise');

function NotepadClient(apiUrl) {
  this.apiUrl = apiUrl;
};

NotepadClient.prototype.makeUrl = function(relativePath) {
  return this.apiUrl + relativePath;
};

NotepadClient.prototype.getPromise = function(relativePath) {
  var url = this.makeUrl(relativePath);
  return rp({
    method: 'GET',
    url: url,
    json: true,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.postPromise = function(relativePath, body) {
  var url = this.makeUrl(relativePath);
  return rp({
    method: 'POST',
    url: url,
    json: true,
    body: body,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.deletePromise = function(relativePath) {
  var url = this.makeUrl(relativePath);
  return rp({
    method: 'DELETE',
    url: url,
    json: true,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.getAllNotesPromise = function() {
  return this.getPromise("/notes/");
};

NotepadClient.prototype.createNotePromise = function(note) {
  return this.postPromise("/notes/", note);
};

NotepadClient.prototype.getNotePromise = function(noteId) {
  return this.getPromise("/notes/" + noteId);
};

NotepadClient.prototype.deleteNotePromise = function(noteId) {
  return this.deletePromise("/notes/" + noteId);
};

NotepadClient.prototype.updateNotePromise = function(note) {
  return this.postPromise("/notes/" + note.id, note);
};

NotepadClient.prototype.getAllCategoriesPromise = function() {
  return this.getPromise("/categories/");
};

NotepadClient.prototype.getCategoriesWithNamesStartingWithPromise = function(namePattern) {
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

NotepadClient.prototype.createCategoryPromise = function(category) {
  return this.postPromise("/categories/", category);
};

NotepadClient.prototype.getCategoryPromise = function(categoryId) {
  return this.getPromise("/categories/" + categoryId);
};

NotepadClient.prototype.deleteCategoryPromise = function(categoryId) {
  return this.deletePromise("/categories/" + categoryId);
};

NotepadClient.prototype.updateCategoryPromise = function(category) {
  return this.postPromise("/categories/" + category.id, category);
};

module.exports = NotepadClient;
