describe('directives.testNote', function() {
  beforeEach(module('directives.testNote'));

  describe('testNoteInlineEdit directive', function() {
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

  describe('testNoteEdit directive', function() {
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

  describe('testNoteView directive', function() {
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
});
