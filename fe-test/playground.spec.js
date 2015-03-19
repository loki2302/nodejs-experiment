describe('playground', function() {
  describe("testNoteEdit directive", function() {
    beforeEach(module(function($compileProvider) {
      $compileProvider
      .directive('testNoteEdit', function() {
        return {
          restrict: 'E',
          require: 'ngModel',
          scope: {
            submit: '&',
            note: '=ngModel'
          },
          template: 
          '<form ng-submit="handleSubmit()">' +
          '<input type="text" class="note-text" ng-model="note.text">' +
          '<button type="submit" class="submit">Submit</button>' +
          '</form>',
          link: function(scope) {
            // do setAllFieldsValid
            scope.handleSubmit = function() {
              //scope.vf.setAllFieldsValid();
              console.log("SUBMIT", navigator.userAgent);

              scope.submit({note: scope.note}).then(function(resolution) {
                // success, resolution is ignored
                console.log('success', resolution, navigator.userAgent);
              }, function(error) {
                // error, resoltion is expected to be a validation error map
                console.log('error', error);
                //scope.vf.setFieldErrors(error);
              });
            };
          }
        };
      })
      /*.directive('validationFacade', function() {
        // use like this: <form be="be">
        // this will publish 'be' with setAllFieldsValid and setFieldErrors
        // to the related scope
        return {
          require: 'form',
          link: function(scope, element, attrs, ctrl) {
            var errors = {};
            scope[attrs.validationFacade] = {
              setAllFieldsValid: function() {
                angular.forEach(ctrl, function(formElement, fieldName) {
                  if(fieldName[0] === '$') {
                    return;
                  }

                  ctrl[fieldName].$setValidity('omg', true);              
                });
                errors = {};
              },
              setFieldErrors: function(errorMap) {
                angular.forEach(errorMap, function(message, fieldName) {
                  ctrl[fieldName].$setValidity('omg', false);
                  ctrl[fieldName].$setPristine();
                });
                errors = errorMap;
              },
              getFieldError: function(fieldName) {
                return errors[fieldName];
              },
              isError: function(fieldName) {
                return ctrl[fieldName].$invalid && ctrl[fieldName].$pristine;
              }
            };
          }
        };
      });*/
    }));

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
      $scope.onSubmitClicked = jasmine.createSpy('onSubmitClicked').and.returnValue($q.when(123));
      $rootScope.$digest();

      element.find('.submit').submit(); // WTF??? works OK in FF and Chrome
      // element.find('button[type="submit"]').click(); // WTF??? only triggers in Chrome
      // element.find('.submit').click(); // WTF??? only triggers in Chrome
      // element.find('button').click(); // WTF??? only triggers in Chrome

      console.log(element.find('button'));
      
      expect($scope.onSubmitClicked).toHaveBeenCalled();
    }));

    /*it('should work', inject(function($compile, $q) {
      var element = $compile('<test-note-edit ng-model="note" submit="onSubmitClicked(note)"></test-note-edit>')($scope);
      $scope.onSubmitClicked = function(m) {
        console.log('onSubmitClicked', m);
        return $q.when();
      };

      $rootScope.$digest();
      //expect(element.find('div').text()).toBe('hello');
      element.find('button').click();
    }));*/
  });
  

  describe("testNoteView directive", function() {
    beforeEach(module(function($compileProvider) {
      $compileProvider.directive('testNoteView', function() {
        return {
          restrict: 'E',
          require: 'ngModel',
          scope: {
            note: "=ngModel",
            edit: "&"
          },
          template: 
          '<div>' + 
          '  <span class="note-text">{{note.text}}</span>' + 
          '  <button class="note-edit" type="button" ng-click="edit({note: note})">Edit</button>' + 
          '</div>',
          controller: function($scope, $element, $attrs, $transclude, /*any injectables*/ $log) {
            // console.log('controller'); // 1: before link
          },
          link: function(scope, element, attrs /*, parentController */) {
            // console.log('link'); // 2: after controller
          }        
        };
      });
    }));

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
