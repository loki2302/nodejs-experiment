describe('tbTeamEditor', function() {
  beforeEach(module('tbTeamEditor', 'tbTemplates'));

  var $scope;
  var $compile;
  var $q;
  beforeEach(inject(function($rootScope, _$compile_, _$q_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $q = _$q_;
  }));

  it('should throw if submitTitle is not set', function() {
    $compile(
      '<tb-team-editor ' +
      '  busy="busy"' +
      '  team-template="{}">' +
      '</tb-team-editor>')($scope);
    expect(function() {
      $scope.$digest();
    }).toThrow();
  });

  it('should throw if teamTemplate is not set', function() {
    $compile(
      '<tb-team-editor ' +
      '  busy="busy"' +
      '  submit-title="Submit">' +
      '</tb-team-editor>')($scope);
    expect(function() {
      $scope.$digest();
    }).toThrow();
  });

  it('should not throw if everything is set', function() {
    $compile(
      '<tb-team-editor ' +
      '  busy="busy"' +
      '  submit-title="Submit"' +
      '  team-template="{}">' +
      '</tb-team-editor>')($scope);
    expect(function() {
      $scope.$digest();
    }).not.toThrow();
  });

  it('should set up the submit button text based on submitTitle', function() {
    var element = $compile(
      '<tb-team-editor ' +
      '  busy="busy"' +
      '  submit-title="Hello World"' +
      '  team-template="{}">' +
      '</tb-team-editor>')($scope);

    $scope.$digest();

    var ui = new UiMap(element);
    expect(ui.submitButtonElement().text()).toBe('Hello World');
  });

  it('should prepopulate the fields based on teamTemplate', function() {
    $scope.team = { name: 'the team' };
    var element = $compile(
      '<tb-team-editor ' +
      '  busy="busy"' +
      '  submit-title="Hello World"' +
      '  team-template="team">' +
      '</tb-team-editor>')($scope);

    $scope.$digest();

    var ui = new UiMap(element);
    expect(ui.nameInputElement().val()).toBe('the team');
  });

  describe('busy handling', function() {
    var ui;
    beforeEach(inject(function() {
      var element = $compile(
        '<tb-team-editor ' +
        '  busy="busy"' +
        '  submit-title="Hello World"' +
        '  team-template="{}"' +
        '</tb-team-editor>')($scope);
      $scope.$digest();

      ui = new UiMap(element);
    }));

    it('should enable the form contents as long as "busy" is false', function() {
      $scope.$apply(function() {
        $scope.busy = false;
      });

      expect(ui.fieldsetElement().attr('disabled')).toBeUndefined();
    });

    it('should disable the form contents as long as "busy" is true', function() {
      $scope.$apply(function() {
        $scope.busy = true;
      });

      expect(ui.fieldsetElement().attr('disabled')).toBe('disabled');
    });
  });

  describe('submission', function() {
    var handleTeamDeferred;
    var ui;
    beforeEach(inject(function() {
      handleTeamDeferred = $q.defer();
      $scope.team = { name: 'the team' };
      $scope.handleTeam = jasmine.createSpy('handleTeam').and.callFake(function() {
        return handleTeamDeferred.promise;
      });
      var element = $compile(
        '<tb-team-editor ' +
        '  submit-title="Hello World"' +
        '  team-template="team"' +
        '  on-submit="handleTeam(team)">' +
        '</tb-team-editor>')($scope);
      $scope.$digest();

      ui = new UiMap(element);
      ui.formElement().submit();
    }));

    it('should call onSubmit when the form is submitted', function() {
      expect($scope.handleTeam).toHaveBeenCalledWith({ name: 'the team' });
    });

    it('should display validation errors when onSubmit returns a rejection', function() {
      $scope.$apply(function() {
        handleTeamDeferred.reject({ name: 'ugly' });
      });

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(true);
      expect(ui.nameInputElement().val()).toBe('the team');
      expect(ui.nameHelpBlockElement().text()).toBe('ugly');
    });

    it('should do nothing when onSubmit succeeds', function() {
      $scope.$apply(function() {
        handleTeamDeferred.resolve();
      });

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
      expect(ui.nameInputElement().val()).toBe('the team');
    });

    it('should eliminate the validation errors once the form is touched', function() {
      $scope.$apply(function() {
        handleTeamDeferred.reject({ name: 'the team' });
      });

      ui.nameInputElement().val('the tean 2');
      ui.nameInputElement().change();

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
    });

    it('should eliminate the validation errors when the form is submitted again after the previous rejection', function() {
      $scope.$apply(function() {
        handleTeamDeferred.reject({ name: 'ugly' });
      });

      handleTeamDeferred = $q.defer();
      ui.formElement().submit();

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
      $scope.$apply(function() {
        handleTeamDeferred.reject({ name: 'ugly' });
      });
      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(true);
    });
  });

  function UiMap(element) {
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

    this.submitButtonElement = function() {
      return element.find('button[type="submit"]');
    };
  };
});
