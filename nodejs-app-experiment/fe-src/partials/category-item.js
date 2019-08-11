angular.module('directives.categories.categoryItem', [
  'app.directives.validation'
])
.directive('categoryItem', function() {
  return {
    restrict: 'E',
    scope: {
      category: '=',
      busy: '=',
      onDelete: '&',
      onUpdate: '&'
    },
    templateUrl: 'partials/category-item.html',
    link: function(scope) {
      scope.editingCategory = null;

      scope.deleteCategory = function() {
        scope.onDelete({
          category: scope.category
        });
      };

      scope.switchToEditMode = function() {        
        scope.editingCategory = angular.copy(scope.category);
      };

      scope.switchToViewMode = function() {
        scope.editingCategory = null;
      };

      scope.updateCategory = function(validationFacade) {        
        validationFacade.setAllFieldsValid();
        scope.onUpdate({
          updatedCategory: scope.editingCategory
        }).then(function() {
          scope.switchToViewMode();
        }, function(error) {          
          validationFacade.setFieldErrors(error);
        });
      };
    }
  };
});
