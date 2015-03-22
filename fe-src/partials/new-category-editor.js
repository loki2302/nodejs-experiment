angular.module('directives.categories.newCategoryEditor', ['app.directives.utils'])
.directive('newCategoryEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&',
      busy: '='
    },
    template:
    '<h3>Create category</h3>' +
    '<form ng-submit="createCategory()" validation-facade="vf">' + 
    '  <fieldset ng-disabled="busy">' +
    '    <div class="form-group" ng-class="{' + "'has-error'" + ':vf.isError(' + "'name'" + ')}">' +
    '      <label for="name" class="control-label">Name</label>' +
    '      <input type="text" class="form-control" id="name" name="name" ng-model="category.name">' +
    '      <p class="help-block" ng-if="vf.isError(' + "'name'" + ')">{{vf.getFieldError(' + "'name'" + ')}}</p>' +
    '    </div>' +
    '    <div class="form-group">' +
    '      <button type="submit" class="btn btn-default">Create</button>' +
    '    </div>' +
    '  </fieldset>' +
    '</form>',
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
