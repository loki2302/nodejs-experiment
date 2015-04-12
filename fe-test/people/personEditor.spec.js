describe('tbPersonEditor logic', function() {
  beforeEach(module('tbPersonEditor', 'tbTemplates'));

  var $scope;
  var $compile;
  var $q;
  beforeEach(inject(function($rootScope, _$compile_, _$q_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
    $q = _$q_;
  }));

  describe('construction', function() {
    it('should throw if submitTitle is not set', function() {
      $compile(
        '<tb-person-editor ' +
        '  busy="busy"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).toThrow();
    });

    it('should throw if personTemplate is not set', function() {
      $compile(
        '<tb-person-editor ' +
        '  busy="busy"' +
        '  submit-title="Submit">' +
        '</tb-person-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).toThrow();
    });

    it('should not throw if everything is set', function() {
      $compile(
        '<tb-person-editor ' +
        '  busy="busy"' +
        '  submit-title="Submit"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);
      expect(function() {
        $scope.$digest();
      }).not.toThrow();
    });

    describe('isolate scope', function() {
      var scope;
      beforeEach(function() {
        var element = $compile(
          '<tb-person-editor ' +
          '  busy="busy"' +
          '  submit-title="Submit"' +
          '  person-template="{}">' +
          '</tb-person-editor>')($scope);
        $scope.$digest();
        scope = element.isolateScope();
      });

      it('should publish the "person" on a scope', function() {
        expect(scope.person).toBeDefined();
      });

      it('should publish the "newMembership" on a scope', function() {
        expect(scope.newMembership).toBeDefined();
      });
    });
  });

  describe('submitPerson', function() {
    var scope;
    var onSubmitDeferred;
    beforeEach(function() {
      onSubmitDeferred = $q.defer();
      $scope.onSubmit = jasmine.createSpy('onSubmit').and.callFake(function() {
        return onSubmitDeferred.promise;
      });
      var element = $compile(
        '<tb-person-editor ' +
        '  on-submit="onSubmit(person)"' +
        '  submit-title="Submit"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.submitPerson).toBeDefined();
    });

    it('should call onSubmit', function() {
      scope.person = { id: 123 };
      scope.submitPerson({ preventDefault: angular.noop });
      expect($scope.onSubmit).toHaveBeenCalledWith({ id: 123 });
    });

    it('should reload the person from personTemplate if onSubmit resolves', function() {
      scope.person = { id: 123 };
      scope.submitPerson({ preventDefault: angular.noop });
      onSubmitDeferred.resolve();
      $scope.$digest();
      expect(scope.person).toEqual({});
    });

    it('should handle validation errors if onSubmit rejects', function() {
      scope.person = { id: 123 };

      spyOn(scope.vf, 'setFieldErrors');
      scope.submitPerson({ preventDefault: angular.noop });
      onSubmitDeferred.reject({
        name: 'ugly'
      });
      $scope.$digest();

      expect(scope.vf.setFieldErrors).toHaveBeenCalledWith({
        name: 'ugly'
      });
    });
  });

  describe('searchTeams', function() {
    var scope;
    var onTeamLookupDeferred;
    beforeEach(function() {
      onTeamLookupDeferred = $q.defer();
      $scope.onTeamLookup = jasmine.createSpy('onTeamLookup').and.callFake(function() {
        return onTeamLookupDeferred.promise;
      });
      var element = $compile(
        '<tb-person-editor ' +
        '  on-team-lookup="onTeamLookup(query)"' +
        '  submit-title="Submit"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.searchTeams).toBeDefined();
    });

    it('should call onTeamLookup', function() {
      scope.searchTeams('a');
      expect($scope.onTeamLookup).toHaveBeenCalled();
    });

    it('should return the result if onTeamLookup succeeds', function() {
      var onSuccess = jasmine.createSpy('onSuccess');
      scope.searchTeams('a').then(onSuccess);
      onTeamLookupDeferred.resolve('hello');
      $scope.$digest();
      expect(onSuccess).toHaveBeenCalledWith('hello');
    });

    it('should return an empty collection if onTeamLookup fails', function() {
      var onSuccess = jasmine.createSpy('onSuccess');
      scope.searchTeams('a').then(onSuccess);
      onTeamLookupDeferred.reject('error');
      $scope.$digest();
      expect(onSuccess).toHaveBeenCalledWith([]);
    });
  });

  describe('canAddMember', function() {
    var scope;
    beforeEach(function() {
      var element = $compile(
        '<tb-person-editor ' +
        '  submit-title="Submit"' +
        '  person-template="{}">' +
        '</tb-person-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.canAddMembership).toBeDefined();
    });

    it('should return false if newMembership is not set', function() {
      scope.newMembership = null;
      expect(scope.canAddMembership()).toBe(false);
    });

    it('should return false if newMembership.team is not set', function() {
      scope.newMembership = {
        role: 'developer'
      };
      expect(scope.canAddMembership()).toBe(false);
    });

    it('should return false if newMembership.role is not set', function() {
      scope.newMembership = {
        team: {}
      };
      expect(scope.canAddMembership()).toBe(false);
    });

    it('should return true if newMembership has everything set up', function() {
      scope.newMembership = {
        team: {},
        role: 'developer'
      };
      expect(scope.canAddMembership()).toBe(true);
    });
  });

  describe('addMembership', function() {
    var scope;
    beforeEach(function() {
      var element = $compile(
        '<tb-person-editor ' +
        '  submit-title="Submit"' +
        '  person-template="{memberships:[]}">' +
        '</tb-person-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.addMembership).toBeDefined();
    });

    it('should throw if canAddMembership() returns false', function() {
      scope.canAddMembership = jasmine.createSpy('canAddMembership').and.returnValue(false);
      expect(function() {
        scope.addMembership();
      }).toThrow();
      expect(scope.canAddMembership).toHaveBeenCalled();
    });

    it('should append a new membership to the list of memberships', function() {
      scope.canAddMembership = function() { return true; };
      scope.newMembership = 'new membership';
      scope.addMembership();
      expect(scope.person.memberships).toEqual(['new membership']);
    });

    it('should clean up the current new membership', function() {
      scope.canAddMembership = function() { return true; };
      scope.newMembership = 'new membership';
      scope.addMembership();
      expect(scope.newMembership).toEqual({});
    });
  });

  describe('removeMembership', function() {
    var scope;
    beforeEach(function() {
      $scope.person = {
        memberships: [
          {
            team: { id: 11 }
          }
        ]
      };
      var element = $compile(
        '<tb-person-editor ' +
        '  submit-title="Submit"' +
        '  person-template="person">' +
        '</tb-person-editor>')($scope);

      $scope.$digest();
      scope = element.isolateScope();
    });

    it('should be defined', function() {
      expect(scope.removeMembership).toBeDefined();
    });

    it('should throw if membership is not on the list', function() {
      expect(function() {
        scope.removeMembership({});
      }).toThrow();
      expect(scope.person.memberships.length).toBe(1);
    });

    it('should remove the membership if it is on the list', function() {
      scope.removeMembership(scope.person.memberships[0]);
      expect(scope.person.memberships.length).toBe(0);
    });
  });
});


/*describe('tbPersonEditor', function() {
  beforeEach(module('tbPersonEditor', 'tbTemplates'));

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
      '<tb-person-editor ' +
      '  busy="busy"' +
      '  person-template="{}">' +
      '</tb-person-editor>')($scope);
    expect(function() {
      $scope.$digest();
    }).toThrow();
  });

  it('should throw if personTemplate is not set', function() {
    $compile(
      '<tb-person-editor ' +
      '  busy="busy"' +
      '  submit-title="Submit">' +
      '</tb-person-editor>')($scope);
    expect(function() {
      $scope.$digest();
    }).toThrow();
  });

  it('should not throw if everything is set', function() {
    $compile(
      '<tb-person-editor ' +
      '  busy="busy"' +
      '  submit-title="Submit"' +
      '  person-template="{}">' +
      '</tb-person-editor>')($scope);
    expect(function() {
      $scope.$digest();
    }).not.toThrow();
  });

  it('should set up the submit button text based on submitTitle', function() {
    var element = $compile(
      '<tb-person-editor ' +
      '  busy="busy"' +
      '  submit-title="Hello World"' +
      '  person-template="{}">' +
      '</tb-person-editor>')($scope);

    $scope.$digest();

    var ui = new UiMap(element);
    expect(ui.submitButtonElement().text()).toBe('Hello World');
  });

  it('should prepopulate the fields based on personTemplate', function() {
    $scope.person = {
      name: 'john smith',
      memberships: [
        {
          team: { id: 123, name: 'the team' },
          role: 'developer'
        }
      ]
    };
    var element = $compile(
      '<tb-person-editor ' +
      '  busy="busy"' +
      '  submit-title="Hello World"' +
      '  person-template="person">' +
      '</tb-person-editor>')($scope);

    $scope.$digest();

    var ui = new UiMap(element);
    expect(ui.nameInputElement().val()).toBe('john smith');

    var firstPersonMembershipElement = ui.personMembershipElement(0);
    expect(firstPersonMembershipElement.text()).toContain('the team');
    // TODO: there's an input field now
    // expect(firstPersonMembershipElement.text()).toContain('developer');
  });

  describe('busy handling', function() {
    var ui;
    beforeEach(inject(function() {
      var element = $compile(
        '<tb-person-editor ' +
        '  busy="busy"' +
        '  submit-title="Hello World"' +
        '  person-template="{}"' +
        '</tb-person-editor>')($scope);
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
    var handlePersonDeferred;
    var ui;
    beforeEach(inject(function() {
      handlePersonDeferred = $q.defer();
      $scope.person = { name: 'john' };
      $scope.handlePerson = jasmine.createSpy('handlePerson').and.callFake(function() {
        return handlePersonDeferred.promise;
      });
      var element = $compile(
        '<tb-person-editor ' +
        '  submit-title="Hello World"' +
        '  person-template="person"' +
        '  on-submit="handlePerson(person)">' +
        '</tb-person-editor>')($scope);
      $scope.$digest();

      ui = new UiMap(element);
      ui.formElement().submit();
    }));

    it('should call onSubmit when the form is submitted', function() {
      expect($scope.handlePerson).toHaveBeenCalledWith({ name: 'john' });
    });

    it('should display validation errors when onSubmit returns a rejection', function() {
      $scope.$apply(function() {
        handlePersonDeferred.reject({ name: 'ugly' });
      });

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(true);
      expect(ui.nameInputElement().val()).toBe('john');
      expect(ui.nameHelpBlockElement().text()).toBe('ugly');
    });

    it('should do nothing when onSubmit succeeds', function() {
      $scope.$apply(function() {
        handlePersonDeferred.resolve();
      });

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
      expect(ui.nameInputElement().val()).toBe('john');
    });

    it('should eliminate the validation errors once the form is touched', function() {
      $scope.$apply(function() {
        handlePersonDeferred.reject({ name: 'ugly' });
      });

      ui.nameInputElement().val('john1');
      ui.nameInputElement().change();

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
    });

    it('should eliminate the validation errors when the form is submitted again after the previous rejection', function() {
      $scope.$apply(function() {
        handlePersonDeferred.reject({ name: 'ugly' });
      });

      handlePersonDeferred = $q.defer();
      ui.formElement().submit();

      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(false);
      $scope.$apply(function() {
        handlePersonDeferred.reject({ name: 'ugly' });
      });
      expect(ui.nameFormGroupElement().hasClass('has-error')).toBe(true);
    });
  });

  describe('membership removal', function() {
    var handlePersonDeferred;
    var ui;
    beforeEach(inject(function() {
      handlePersonDeferred = $q.defer();
      $scope.person = {
        name: 'john',
        memberships: [
          {
            team: { id: 111, name: 'team a' },
            role: 'developer'
          },
          {
            team: { id: 222, name: 'team b' },
            role: 'qa'
          }
        ]
      };
      $scope.handlePerson = jasmine.createSpy('handlePerson').and.callFake(function() {
        return handlePersonDeferred.promise;
      });
      var element = $compile(
        '<tb-person-editor ' +
        '  submit-title="Hello World"' +
        '  person-template="person"' +
        '  on-submit="handlePerson(person)">' +
        '</tb-person-editor>')($scope);
      $scope.$digest();

      ui = new UiMap(element);
    }));

    // TODO: check if I can somehow look at the real remove functionality

    it('should remove a member when Remove button is clicked', function() {
      ui.personMembershipRemoveButtonElement(0).click();
      ui.formElement().submit();

      // first argument of first call to handleTeam(x)
      var submittedPerson = $scope.handlePerson.calls.allArgs()[0][0];
      expect(submittedPerson.memberships.length).toBe(1);
      expect(submittedPerson.memberships[0].team.id).toBe(222);
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

    this.personMembershipElement = function(index) {
      var elementClassName = 'li.membership-' + index;
      return element.find(elementClassName);
    };

    this.personMembershipRemoveButtonElement = function(index) {
      var elementClassName = 'li.membership-' + index + ' button';
      return element.find(elementClassName);
    };

    this.submitButtonElement = function() {
      return element.find('button#submit-person-button');
    };
  };
});
*/
