describe('tbNewPersonEditor', function() {
  beforeEach(module('tbNewPersonEditor', 'tbTemplates'));

  var $q;
  var $scope;
  var uiMap;
  beforeEach(inject(function(_$q_, $rootScope, $compile) {
    $q = _$q_;
    $scope = $rootScope.$new();

    var element = $compile(
      '<tb-new-person-editor on-create="createPerson(person)" busy="busy">' +
      '</tb-new-person-editor>')($scope);
    uiMap = new UIMap(element);

    createPersonDeferred = $q.defer();
    $scope.createPerson = jasmine.createSpy('createPerson')
      .and.returnValue(createPersonDeferred.promise);
    $scope.busy = false;
    $scope.$digest();

    uiMap.nameInputElement().val('john');
    uiMap.nameInputElement().change();
    uiMap.formElement().submit();
  }));

  it('should call on-create when the form is submitted', function() {
    expect($scope.createPerson).toHaveBeenCalledWith({
      name: 'john'
    });
  });

  it('should display validation errors if on-create returns an error', function() {
    $scope.$apply(function() {
      createPersonDeferred.reject({
        name: 'too ugly'
      });
    });

    expect(uiMap.nameFormGroupElement().hasClass('has-error')).toBe(true);
    expect(uiMap.nameInputElement().val()).toBe('john');
    expect(uiMap.nameHelpBlockElement().text()).toBe('too ugly');
  });

  it('should empty the fields if on-create returns success', function() {
    $scope.$apply(function() {
      createPersonDeferred.resolve();
    });

    expect(uiMap.nameFormGroupElement().hasClass('has-error')).toBe(false);
    expect(uiMap.nameInputElement().val()).toBe('');
    expect(uiMap.nameHelpBlockElement().length).toBe(0);
  });

  it('should enable the form contents as long as "busy" is false', function() {
    $scope.$apply(function() {
      $scope.busy = false;
    });

    expect(uiMap.fieldsetElement().attr('disabled')).toBeUndefined();
  });

  it('should disable the form contents as long as "busy" is true', function() {
    $scope.$apply(function() {
      $scope.busy = true;
    });

    expect(uiMap.fieldsetElement().attr('disabled')).toBe('disabled');
  });

  function UIMap(element) {
    this.formElement = function() {
      return element.find('form');
    };

    this.fieldsetElement = function() {
      return element.find('fieldset');
    };

    this.nameFormGroupElement = function() {
      return element.find('.form-group.name');
    };

    this.nameInputElement = function() {
      return element.find('.form-group.name input');
    };

    this.nameHelpBlockElement = function() {
      return element.find('.form-group.name .help-block');
    };
  };
});
