angular.module("directives.categories.categoryEditor2", ['app.directives.utils'])
.directive("createCategory", function() {
  return {
    restrict: 'E',
    scope: {
      create: '&',
      busy: '='
    },
    template:
    '<h3>Create category</h3>' +
    '<form ng-submit="onSubmit()" validation-facade="vf">' + 
    '  <fieldset ng-disabled="busy">' +
    '    <div class="form-group" ng-class="{' + "'has-error'" + ':vf.isError(' + "'name'" + ')}">' +
    '      <label for="name" class="control-label">Name</label>' +
    '      <input type="text" class="form-control" id="name" name="name" ng-model="name">' +
    '      <p class="help-block" ng-if="vf.isError(' + "'name'" + ')">{{vf.getFieldError(' + "'name'" + ')}}</p>' +
    '    </div>' +
    '    <div class="form-group">' +
    '      <button type="submit" class="btn btn-default">Create</button>' +
    '    </div>' +
    '  </fieldset>' +
    '</form>',
    link: function(scope) {
      scope.name = "";

      scope.onSubmit = function() {
        scope.vf.setAllFieldsValid();

        scope.create({
          category: {
            name: scope.name
          }
        }).then(function() {
          // success: reset all the fields
          scope.name = "";
        }, function(error) {
          // error: set validation errors
          scope.vf.setFieldErrors(error);
        });
      };
    }
  };
});
