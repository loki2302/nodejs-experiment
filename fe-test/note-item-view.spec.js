describe('NoteItemView directive', function() {
  beforeEach(module('directives.notes.noteItemView'));
  beforeEach(module('note-item-view.html'));
  
  var $scope;
  var element;
  beforeEach(inject(function($rootScope, $compile) {
    $scope = $rootScope;
    element = $compile('<note-item-view note="n" delete="onDeleteNote(note)"></note-item-view>')($scope);
  }));

  it('should somehow be set up', inject(function() {
    $scope.$apply(function() {
      $scope.n = {
        id: 123,
        content: 'hello there',
        categories: []
      };
    });
    
    expect(element.find('.note-id').text()).toBe('123');
    expect(element.find('.note-content').text()).toBe('hello there');
    expect(element.text()).toContain('Delete');
    expect(element.text()).toContain('Edit');
    expect(element.text()).toContain('Linked to no categories');
  }));

  it('should delete', inject(function($q) {
    var deleteNoteDeferred = $q.defer();
    var onDeleteNote = jasmine.createSpy('onDeleteNote').and.returnValue(deleteNoteDeferred.promise);
    $scope.$apply(function() {
      $scope.n = {
        id: 123,
        content: 'hello there',
        categories: []
      };

      $scope.onDeleteNote = onDeleteNote;
    });

    expect(element.find('.delete').hasClass('disabled')).toBe(false);
    element.find('.delete').click();
    expect(onDeleteNote).toHaveBeenCalledWith(jasmine.objectContaining({
      id: 123
    }));

    expect(element.find('.delete').hasClass('disabled')).toBe(true);
  }));
});
