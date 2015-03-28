var rp = require('request-promise');
var URI = require('URIjs');
var URITemplate = require('URIjs/src/URITemplate');

function NotepadClient(apiUrl) {
  this.apiUrl = apiUrl;
};

NotepadClient.prototype.makeUrl = function(resourceTemplateString, resourceValues) {
  var apiRootUri = new URI(this.apiUrl);
  var resourceTemplate = new URITemplate(resourceTemplateString);
  var resourceUri = new URI(resourceTemplate.expand(resourceValues));
  var uri = resourceUri.absoluteTo(apiRootUri);
  var uriString = uri.toString();
  return uriString;
};

NotepadClient.prototype.get = function(resourceTemplateString, resourceValues) {
  var url = this.makeUrl(resourceTemplateString, resourceValues);
  return rp({
    method: 'GET',
    url: url,
    json: true,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.post = function(resourceTemplateString, resourceValues, body) {
  var url = this.makeUrl(resourceTemplateString, resourceValues);
  return rp({
    method: 'POST',
    url: url,
    json: true,
    body: body,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.delete = function(resourceTemplateString, resourceValues) {
  var url = this.makeUrl(resourceTemplateString, resourceValues);
  return rp({
    method: 'DELETE',
    url: url,
    json: true,
    resolveWithFullResponse: true
  });
};

NotepadClient.prototype.getAllNotes = function() {
  return this.get("notes/");
};

NotepadClient.prototype.createNote = function(note) {
  return this.post("notes/", null, note);
};

NotepadClient.prototype.getNote = function(noteId) {
  return this.get("notes/{id}", { id: noteId });
};

NotepadClient.prototype.deleteNote = function(noteId) {
  return this.delete("notes/{id}", { id: noteId });
};

NotepadClient.prototype.updateNote = function(note) {
  return this.post("notes/{id}", { id: note.id }, note);
};

NotepadClient.prototype.getAllCategories = function() {
  return this.get("categories/");
};

NotepadClient.prototype.getCategoriesWithNamesStartingWith = function(namePattern) {
  var url = this.makeUrl("categories/");
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
  return this.post("categories/", null, category);
};

NotepadClient.prototype.getCategory = function(categoryId) {
  return this.get("categories/{id}", { id: categoryId });
};

NotepadClient.prototype.deleteCategory = function(categoryId) {
  return this.delete("categories/{id}", { id: categoryId });
};

NotepadClient.prototype.updateCategory = function(category) {
  return this.post("categories/{id}", { id: category.id }, category);
};

module.exports = NotepadClient;
