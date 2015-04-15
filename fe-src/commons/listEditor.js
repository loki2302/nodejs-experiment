angular.module('tbListEditor', [])
.directive('tbListEditor', ['$parse', function($parse) {
  return {
    scope: true,
    link: function(scope, element, attrs, controller, transclude) {
      var collectionExpression = attrs.for;
      if(!collectionExpression) {
        throw new Error('"for" is required');
      }

      var publishName = attrs.as;
      if(!publishName) {
        throw new Error('"as" is required');
      }

      scope[attrs.as] = {
        removeItem: function(item) {
          var items = scope.$eval(collectionExpression);
          var itemIndex = items.indexOf(item);
          if(itemIndex < 0) {
            throw new Error('Did not find an item');
          }

          items.splice(itemIndex, 1);
        },
        newItem: {},
        addItem: function() {
          var items = scope.$eval(collectionExpression);
          items.push(scope[attrs.as].newItem);
          scope[attrs.as].newItem = {};
        }
      };
    }
  };
}]);
