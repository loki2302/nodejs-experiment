angular.module('URIjs', [])
.factory('URI', function() {
  if(!URI) {
    throw new Error('URI is not defined. Did you add URI.js?');
  }

  return URI;
})
.factory('URITemplate', function() {
  if(!URITemplate) {
    throw new Error('URITemplate is not defined. Did you add URITemplate.js?');
  }

  return URITemplate;
});
