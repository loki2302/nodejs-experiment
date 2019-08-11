angular.module('api.buildUri', [
  'URIjs'
]).factory('buildUri', ['URI', 'URITemplate', function(URI, URITemplate) {
  return function(apiRootUriString, resourceTemplateString, resourceValues) {
    var apiRootUri = new URI(apiRootUriString);
    var resourceTemplate = new URITemplate(resourceTemplateString);
    var resourceUri = new URI(resourceTemplate.expand(resourceValues));
    var uri = resourceUri.absoluteTo(apiRootUri);
    return uri.toString();
  };
}]);
