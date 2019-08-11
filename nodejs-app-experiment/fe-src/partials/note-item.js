angular.module('directives.notes.noteItem', [
  'app.directives.validation',
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
    templateUrl: 'partials/note-item.html',
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
