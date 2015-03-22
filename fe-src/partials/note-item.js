angular.module('directives.notes.noteItem', [
  'app.directives.utils',
  'ngTagsInput'
])
.directive('noteItem', function() {
  return {
    restrict: 'E',
    scope: {
      note: '=',
      busy: '=',
      onDelete: '&',
      onUpdate: '&',
      onSearchCategories: '&'
    },
    template:
    '<div ng-if="!editingNote">' +
    '  <span class="badge note-id">{{note.id}}</span>' +
    '  <span class="note-content">{{note.content}}</span>' +
    '  <button ng-click="deleteNote()" class="btn btn-default" ng-class="{' + "'disabled': busy" + '}">Delete</button>' +
    '  <button ng-click="switchToEditMode()" class="btn btn-default" ng-class="{' + "'disabled': busy" + '}">Edit</button>' +
    '  <span ng-if="note.categories.length === 0">Linked to no categories</span>' +
    '  <span ng-if="note.categories.length > 0"><span class="badge" ng-repeat="category in note.categories">{{category.name}}</span></span>' +    
    '</div>' +
    '<div ng-if="editingNote">' +
    '  <form ng-submit="updateNote(vf)" validation-facade="vf">' +
    '    <fieldset ng-disabled="busy">' +
    '      <div class="form-group" ng-class="{' + "'has-error'" + ':vf.isError(' + "'content'" + ')}">' +
    '        <label for="content" class="control-label">Content</label>' +
    '        <input type="text" class="form-control" id="content" name="content" ng-model="editingNote.content">' +
    '        <p class="help-block" ng-if="vf.isError(' + "'content'" + ')">{{vf.getFieldError(' + "'content'" + ')}}</p>' +
    '      </div>' +
    '      <tags-input ng-model="editingNote.categories" display-property="name">' +
    '        <auto-complete source="onSearchCategories({$query: $query})"></auto-complete>' +
    '      </tags-input>' +
    '      <div class="form-group">' +
    '        <button type="submit" class="btn btn-default">Update</button>' +
    '        <button type="button" class="btn btn-default" ng-click="switchToViewMode()">Cancel</button>' +
    '      </div>' +
    '    </fieldset>' +
    '  </form>' +
    '</div>',
    link: function(scope) {
      scope.editingNote = null;

      scope.deleteNote = function() {
        scope.onDelete({
          note: scope.note
        });
      };

      scope.switchToEditMode = function() {        
        scope.editingNote = angular.copy(scope.note);
      };

      scope.switchToViewMode = function() {
        scope.editingNote = null;
      };

      scope.updateNote = function(validationFacade) {        
        validationFacade.setAllFieldsValid();
        scope.onUpdate({
          updatedNote: scope.editingNote
        }).then(function() {
          scope.switchToViewMode();
        }, function(error) {          
          validationFacade.setFieldErrors(error);
        });
      };
    }
  };
});
