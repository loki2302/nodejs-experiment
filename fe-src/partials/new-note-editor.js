angular.module('directives.notes.newNoteEditor', [
  'app.directives.utils', 
  'ngTagsInput'
])
.directive('newNoteEditor', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&',
      onSearchCategories: '&',
      busy: '='
    },
    template:
    '<h3>Create note</h3>' +
    '<form ng-submit="createNote()" validation-facade="vf">' + 
    '  <fieldset ng-disabled="busy">' +
    '    <div class="form-group" ng-class="{' + "'has-error'" + ':vf.isError(' + "'content'" + ')}">' +
    '      <label for="content" class="control-label">Content</label>' +
    '      <input type="text" class="form-control" id="content" name="content" ng-model="note.content">' +
    '      <p class="help-block" ng-if="vf.isError(' + "'content'" + ')">{{vf.getFieldError(' + "'content'" + ')}}</p>' +
    '    </div>' +
    '    <tags-input ng-model="note.categories" display-property="name">' +
    '      <auto-complete source="onSearchCategories({$query: $query})"></auto-complete>' +
    '    </tags-input>' +
    '    <div class="form-group">' +
    '      <button type="submit" class="btn btn-default">Create</button>' +
    '    </div>' +
    '  </fieldset>' +
    '</form>',
    link: function(scope) {
      scope.note = makeNoteTemplate();

      scope.createNote = function() {
        scope.vf.setAllFieldsValid();
        scope.onCreate({
          note: scope.note
        }).then(function() {
          scope.note = makeNoteTemplate();
        }, function(error) {
          scope.vf.setFieldErrors(error);
        });
      };

      function makeNoteTemplate() {
        return {
          content: '',
          categories: []
        };
      };
    }
  };
});
