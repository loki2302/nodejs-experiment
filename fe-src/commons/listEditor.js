angular.module('tbListEditor', [])
.directive('tbListEditor', ['$parse', function($parse) {
  return {
    scope: true,
    link: function(scope, element, attrs, controller, transclude) {
      scope[attrs.as] = {
        removeItem: function(item) {
          console.log('remove', item);
          var itemIndex = $parse(attrs.for)(scope).indexOf(item);
          if(itemIndex < 0) {
            throw new Error('Did not find an item');
          }

          $parse(attrs.for)(scope).splice(itemIndex, 1);
        },
        newItem: {},
        addItem: function() {
          $parse(attrs.for)(scope).push(scope[attrs.as].newItem);
          scope[attrs.as].newItem = {};
        }
      };
    }
  };
}]);
