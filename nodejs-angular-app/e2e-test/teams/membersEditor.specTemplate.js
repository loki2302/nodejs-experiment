var makePersonDescription = require('../makePersonDescription');

module.exports = function applyMembersEditorTests(provideConfig) {
  var url;
  var client;
  var newMemberEditor;
  var memberListEditor;
  beforeEach(function() {
    var config = provideConfig();
    if(!config || !config.url || !config.client || !config.newMemberEditor || !config.memberListEditor) throw new Error();

    url = config.url;
    client = config.client;
    newMemberEditor = config.newMemberEditor;
    memberListEditor = config.memberListEditor;
  });

  it('should "Add new member" fields empty', function() {
    browser.get(url);
    expect(newMemberEditor.name.getText()).toBe('');
    expect(newMemberEditor.role.getText()).toBe('');
  });

  it('should not allow adding a new member if the role is not set', function() {
    var personDescription = makePersonDescription(0);
    await(function() {
      return client.createPerson(personDescription);
    });

    browser.get(url);
    newMemberEditor.name.sendKeys('j');
    newMemberEditor.nameDropdownItem(0).click();
    expect(newMemberEditor.add.getAttribute('disabled')).not.toBeNull();
  });

  it('should not allow adding a new member if the person is not set', function() {
    browser.get(url);
    newMemberEditor.role.sendKeys('developer');
    expect(newMemberEditor.add.getAttribute('disabled')).not.toBeNull();
  });

  it('should allow adding a new member if both person and role are set', function() {
    var personDescription = makePersonDescription(0);
    await(function() {
      return client.createPerson(personDescription);
    });

    browser.get(url);
    newMemberEditor.name.sendKeys('j');
    newMemberEditor.nameDropdownItem(0).click();
    newMemberEditor.role.sendKeys('developer');
    expect(newMemberEditor.add.getAttribute('disabled')).toBeNull();

    newMemberEditor.add.click();

    expect(memberListEditor.memberCount()).toBe(1);
    expect(memberListEditor.member(0)).toBeDefined();
    expect(memberListEditor.name(0).getText()).toBeDefined();
    expect(memberListEditor.role(0).getText()).toBeDefined();
    expect(memberListEditor.remove(0)).toBeDefined();
  });

  /*it('should allow removing an existing membership', function() {
    var teamDescription = makeTeamDescription(0);
    await(function() {
      return client.createTeam(teamDescription);
    });

    browser.get(url);
    newMembershipEditor.name.sendKeys('a');
    newMembershipEditor.nameDropdownItem(0).click();
    newMembershipEditor.role.sendKeys('developer');
    newMembershipEditor.add.click();
    membershipListEditor.remove(0).click();
    expect(membershipListEditor.membershipCount()).toBe(0);
  });*/
};
