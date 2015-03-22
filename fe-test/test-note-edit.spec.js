describe('testNoteEdit directive', function() {
  beforeEach(module('directives.testNote'));
  
  var $rootScope;
  var $scope;    
  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
  }));

  it('positive case should work', inject(function($compile, $q) {      
    var element = $compile('<test-note-edit ng-model="note" submit="onSubmitClicked(note)"></test-note-edit>')($scope);
    $scope.note = {
      text: 'hello'
    };
    $scope.onSubmitClicked = jasmine.createSpy('onSubmitClicked').and.returnValue($q.when());
    $rootScope.$digest();

    element.find('form').submit();      
    expect($scope.onSubmitClicked).toHaveBeenCalled();
    expect(element.find('form .text-form-group').hasClass('has-error')).toBe(false);
  }));

  it('negative case should work', inject(function($compile, $q) {
    var element = $compile('<test-note-edit ng-model="note" submit="onSubmitClicked(note)"></test-note-edit>')($scope);
    $scope.note = {
      text: 'hello'
    };
    $scope.onSubmitClicked = jasmine.createSpy('onSubmitClicked').and.returnValue($q.reject({
      text: 'very bad'
    }));
    $rootScope.$digest();

    element.find('form').submit();
    expect($scope.onSubmitClicked).toHaveBeenCalled();
    expect(element.find('form .text-form-group').hasClass('has-error')).toBe(true);
  }));    
});
