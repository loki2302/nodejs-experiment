describe('NoteItemView directive', function() {
  beforeEach(module('directives.notes.noteItemView'));
  beforeEach(module('note-item-view.html'));
  
  var $scope;
  var element;
  beforeEach(inject(function($rootScope, $compile) {
    $scope = $rootScope;
    element = $compile('<note-item-view></note-item-view>')($scope);
    $scope.$digest();
  }));

  it('should do at least something', inject(function() {
    expect(element.text()).toContain('Delete');
    expect(element.text()).toContain('Edit');
  }));
});
