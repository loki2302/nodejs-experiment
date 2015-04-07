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
    $scope.team = {
      name: 'the team',
      members: [
        {
          person: { id: 123, name: 'john' },
          role: 'developer'
        }
      ]
    };
    var element = $compile(
      '<tb-team-editor ' +
      '  busy="busy"' +
      '  submit-title="Hello World"' +
      '  team-template="team">' +
      '</tb-team-editor>')($scope);

    $scope.$digest();

    var ui = new UiMap(element);
    expect(ui.nameInputElement().val()).toBe('the team');

    var firstTeamMemberElement = ui.teamMemberElement(0);
    expect(firstTeamMemberElement.text()).toContain('john');
    expect(firstTeamMemberElement.text()).toContain('developer');
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

      ui.nameInputElement().val('the team 2');
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

  describe('member removal', function() {
    var handleTeamDeferred;
    var ui;
    beforeEach(inject(function() {
      handleTeamDeferred = $q.defer();
      $scope.team = {
        name: 'the team',
        members: [
          {
            person: { id: 111, name: 'person A' },
            role: 'developer'
          },
          {
            person: { id: 222, name: 'person B' },
            role: 'qa'
          }
        ]
      };
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
    }));

    // TODO: check if I can somehow look at the real remove functionality

    it('should remove a member when Remove button is clicked', function() {
      ui.teamMemberRemoveButtonElement(0).click();
      ui.formElement().submit();

      // first argument of first call to handleTeam(x)
      var submittedTeam = $scope.handleTeam.calls.allArgs()[0][0];
      expect(submittedTeam.members.length).toBe(1);
      expect(submittedTeam.members[0].person.id).toBe(222);
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

    this.teamMemberElement = function(index) {
      var elementClassName = 'li.member-' + index;
      return element.find(elementClassName);
    };

    this.teamMemberRemoveButtonElement = function(index) {
      var elementClassName = 'li.member-' + index + ' button';
      return element.find(elementClassName);
    };

    this.submitButtonElement = function() {
      return element.find('button[type="submit"]');
    };
  };
});
