function ContainerBuilder() {
  var values = {};
  var factories = {};
  var apiRoutes = [];

  this.addValues = function(valuesMap) {
    for(var name in valuesMap) {
      values[name] = valuesMap[name];
    }
  };

  this.addFactories = function(factoriesMap) {
    for(var name in factoriesMap) {
      factories[name] = factoriesMap[name];
    }
  };

  this.addRoutes = function(routeArray) {
    apiRoutes = apiRoutes.concat(routeArray);
  };

  this.build = function() {
    // extend factories with all routes + allRoutes
    var routeNames = [];
    apiRoutes.forEach(function(apiRoute, routeIndex) {
      var name = 'apiRoute-' + routeIndex;
      factories[name] = apiRoute;
      routeNames.push(name);
    });

    factories.allRoutes = (function() {
      function RouteCollectionFactory() {
        return Array.prototype.slice.call(arguments);
      };
      RouteCollectionFactory.$inject = routeNames;
      return RouteCollectionFactory;
    })();
    //

    return {
      values: values,
      factories: factories
    };
  };
};

module.exports = ContainerBuilder;
