angular.module('tbBuildUrl', [
]).factory('buildUrl', ['URI', 'URITemplate', function() {
  return function(apiRootUrlString, resourceTemplateString, resourceValues) {
    var apiRootUrl = new URI(apiRootUrlString);
    var resourceTemplate = new URITemplate(resourceTemplateString);
    var resourceUrl = new URI(resourceTemplate.expand(resourceValues));
    var url = resourceUrl.absoluteTo(apiRootUrl);
    return url.toString();
  };
}]).factory('URI', function() {
  if(!URI) {
    throw new Error('URI is not defined. Did you forget to load URI.js?');
  }

  return URI;
}).factory('URITemplate', function() {
  if(!URITemplate) {
    throw new Error('URITemplate is not defined. Did you forget to load URITemplate.js');
  };

  return URITemplate;
});
