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

TeambuildrClient.prototype.request = function(
  method,
  resourceTemplateString,
  resourceValues,
  queryParams,
  body) {

  var url = this.makeUrl(resourceTemplateString, resourceValues);
  return rp({
    simple: false,
    method: method,
    url: url,
    qs: queryParams,
    json: true,
    body: body,
    resolveWithFullResponse: true
  });
};

TeambuildrClient.prototype.get = function(resourceTemplateString, resourceValues, queryParams) {
  return this.request('GET', resourceTemplateString, resourceValues, queryParams);
};

TeambuildrClient.prototype.post = function(resourceTemplateString, resourceValues, body) {
  return this.request('POST', resourceTemplateString, resourceValues, null, body);
};

TeambuildrClient.prototype.put = function(resourceTemplateString, resourceValues, body) {
  return this.request('PUT', resourceTemplateString, resourceValues, null, body);
};

TeambuildrClient.prototype.delete = function(resourceTemplateString, resourceValues) {
  return this.request('DELETE', resourceTemplateString, resourceValues);
};

TeambuildrClient.prototype.createPerson = function(person) {
  return this.post('people', null, person);
};

TeambuildrClient.prototype.getPerson = function(personId) {
  return this.get('people/{id}', { id: personId });
};

TeambuildrClient.prototype.getPeople = function(queryParams) {
  return this.get('people', null, queryParams);
};

TeambuildrClient.prototype.updatePerson = function(person) {
  return this.put('people/{id}', { id: person.id }, person);
};

TeambuildrClient.prototype.deletePerson = function(personId) {
  return this.delete('people/{id}', { id: personId });
};

TeambuildrClient.prototype.createTeam = function(team) {
  return this.post('teams', null, team);
};

TeambuildrClient.prototype.getTeam = function(teamId) {
  return this.get('teams/{id}', { id: teamId });
};

TeambuildrClient.prototype.getTeams = function(queryParams) {
  return this.get('teams', null, queryParams);
};

TeambuildrClient.prototype.updateTeam = function(team) {
  return this.put('teams/{id}', { id: team.id }, team);
};

TeambuildrClient.prototype.deleteTeam = function(teamId) {
  return this.delete('teams/{id}', { id: teamId });
};

TeambuildrClient.prototype.getRandomAvatar = function() {
  return this.get('utils/randomAvatar');
};

TeambuildrClient.prototype.getStats = function() {
  return this.get('utils/stats');
};

module.exports = TeambuildrClient;
