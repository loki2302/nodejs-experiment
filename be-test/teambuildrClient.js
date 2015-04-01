var rp = require('request-promise');
var URI = require('URIjs');
var URITemplate = require('URIjs/src/URITemplate');

function TeambuildrClient(apiUrl) {
  if(!apiUrl) {
    throw new Error('apiUrl should be set explicitly');
  }

  this.apiUrl = apiUrl;
};

TeambuildrClient.prototype.makeUrl = function(resourceTemplateString, resourceValues) {
  var apiRootUri = new URI(this.apiUrl);
  var resourceTemplate = new URITemplate(resourceTemplateString);
  var resourceUri = new URI(resourceTemplate.expand(resourceValues));
  var uri = resourceUri.absoluteTo(apiRootUri);
  var uriString = uri.toString();
  return uriString;
};

TeambuildrClient.prototype.get = function(resourceTemplateString, resourceValues) {
  var url = this.makeUrl(resourceTemplateString, resourceValues);
  return rp({
    method: 'GET',
    url: url,
    json: true,
    resolveWithFullResponse: true
  });
};

TeambuildrClient.prototype.post = function(resourceTemplateString, resourceValues, body) {
  var url = this.makeUrl(resourceTemplateString, resourceValues);
  return rp({
    method: 'POST',
    url: url,
    json: true,
    body: body,
    resolveWithFullResponse: true
  });
};

TeambuildrClient.prototype.helloSuccess = function() {
  return this.get('hello/success');
};

TeambuildrClient.prototype.helloBadRequest = function() {
  return this.get('hello/badRequest');
};

TeambuildrClient.prototype.helloInternalError = function() {
  return this.get('hello/internalError');
};

TeambuildrClient.prototype.createPerson = function(person) {
  return this.post('people', null, person);
};

TeambuildrClient.prototype.getPerson = function(personId) {
  return this.get('people/{id}', { id: personId });
};

module.exports = TeambuildrClient;
