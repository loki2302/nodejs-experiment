angular.module('directives.notes.newNoteEditor', [
  'app.directives.validation', 
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
    templateUrl: 'partials/new-note-editor.html',
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
