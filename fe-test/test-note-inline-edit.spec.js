describe('directives.testNote', function() {
  beforeEach(module('directives.testNote'));
  beforeEach(module(function($compileProvider) {
    $compileProvider.directive('testNoteInlineEdit', function() {
      return {
        restrict: 'E',
        template: 
        '<div ng-if="isEditMode">' + 
        '  editing <button type="button" class="cancel-edit-button" ng-click="onCancelEditClicked()">Cancel</button>' + 
        '</div>' +
        '<div ng-if="!isEditMode">' + 
        '  viewing <button type="button" class="edit-button" ng-click="onEditClicked()">Edit</button>' + 
        '</div>',
        link: function(scope) {
          scope.isEditMode = false;

          scope.onEditClicked = function() {
            scope.isEditMode = true;
          };

          scope.onCancelEditClicked = function() {
            scope.isEditMode = false;
          };
        }
      };
    });
  }));

  it('should be in view mode by default', inject(function($compile, $rootScope) {
    var element = $compile('<test-note-inline-edit></test-note-inline-edit>')($rootScope);
    $rootScope.$digest();
    expect(element.find('button.edit-button').length).toBe(1);
    expect(element.find('button.cancel-edit-button').length).toBe(0);
  }));

  it('should switch to edit mode when Edit button get clicked', inject(function($compile, $rootScope) {
    var element = $compile('<test-note-inline-edit></test-note-inline-edit>')($rootScope);
    $rootScope.$digest();
    element.find('button.edit-button').click();
    expect(element.find('button.edit-button').length).toBe(0);
    expect(element.find('button.cancel-edit-button').length).toBe(1);
  }));

  it('should switch back to view mode when Cancel button gets clicked', inject(function($compile, $rootScope) {
    var element = $compile('<test-note-inline-edit></test-note-inline-edit>')($rootScope);
    $rootScope.$digest();
    element.find('button.edit-button').click();
    element.find('button.cancel-edit-button').click();
    expect(element.find('button.edit-button').length).toBe(1);
    expect(element.find('button.cancel-edit-button').length).toBe(0);
  }));
});
