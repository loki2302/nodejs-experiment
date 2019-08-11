angular.module('directives.categories.newCategoryEditor', [
  'app.directives.validation'
])
.directive('newCategoryEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&',
      busy: '='
    },
    templateUrl: 'partials/new-category-editor.html',
    link: function(scope) {
      scope.category = makeCategoryTemplate();

      scope.createCategory = function() {
        scope.vf.setAllFieldsValid();
        scope.onCreate({
          category: scope.category
        }).then(function() {
          scope.category = makeCategoryTemplate();
        }, function(error) {
          scope.vf.setFieldErrors(error);
        });
      };

      function makeCategoryTemplate() {
        return {
          name: ''
        };
      };
    }
  };
});
