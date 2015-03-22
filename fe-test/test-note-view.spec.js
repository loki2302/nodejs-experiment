describe('testNoteView directive', function() {
  beforeEach(module('directives.testNote'));
  
  var $rootScope;
  var $scope;    
  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));    

  describe('when there is no ngModel', function() {
    it('should not compile', inject(function($compile) {        
      expect(function() {
        $compile('<test-note-view></test-note-view>')($scope);
      }).toThrow();
    }));
  });

  describe('when there is ngModel', function() {
    var element;
    beforeEach(inject(function($compile) {
      element = $compile('<test-note-view ng-model="myNote"></test-note-view>')($scope);
    }));

    it('should have a note-text element', function() {
      expect(element.find('.note-text')).toBeDefined();
    });

    it('should have a note-edit element', function() {
      expect(element.find('.note-edit')).toBeDefined();
    });

    describe('and ngModel references an undefined', function() {
      it('should display an empty text', function() {
        $rootScope.$digest();
        expect(element.find('.note-text').text()).toBe('');
      });
    });

    describe('and ngModel references an object', function() {
      it('should display a text', function() {
        $scope.myNote = {
          text: 'hello there'
        };
        $rootScope.$digest();
        expect(element.find('.note-text').text()).toBe('hello there');
      });
    });
  });

  it('should call an edit handler when handler is set and button gets clicked', inject(function($compile) {
    element = $compile('<test-note-view ng-model="myNote" edit="onEdit(note)"></test-note-view>')($scope);
    $scope.myNote = {
      text: 'hello there',        
    };
    $scope.onEdit = jasmine.createSpy('onEdit');
    $rootScope.$digest();
    element.find('.note-edit').click();
    expect($scope.onEdit).toHaveBeenCalledWith($scope.myNote);
  }));

  it('should do nothing when handler is not set and button gets clicked', inject(function($compile) {
    element = $compile('<test-note-view ng-model="myNote"></test-note-view>')($scope);
    $rootScope.$digest();
    element.find('.note-edit').click();
  }));
}); 