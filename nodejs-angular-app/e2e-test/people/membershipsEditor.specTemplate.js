var makeTeamDescription = require('../makeTeamDescription');

module.exports = function applyMembershipsEditorTests(provideConfig) {
  var url;
  var client;
  var newMembershipEditor;
  var membershipListEditor;
  beforeEach(function() {
    var config = provideConfig();
    if(!config || !config.url || !config.client || !config.newMembershipEditor || !config.membershipListEditor) throw new Error();

    url = config.url;
    client = config.client;
    newMembershipEditor = config.newMembershipEditor;
    membershipListEditor = config.membershipListEditor;
  });

  it('should "Add new membership" fields empty', function() {
    browser.get(url);
    expect(newMembershipEditor.name.getText()).toBe('');
    expect(newMembershipEditor.role.getText()).toBe('');
  });

  it('should not allow adding a new membership if the role is not set', function() {
    var teamDescription = makeTeamDescription(0);
    await(function() {
      return client.createTeam(teamDescription);
    });

    browser.get(url);
    newMembershipEditor.name.sendKeys('a');
    newMembershipEditor.nameDropdownItem(0).click();
    expect(newMembershipEditor.add.getAttribute('disabled')).not.toBeNull();
  });

  it('should not allow adding a new membership if the team is not set', function() {
    browser.get(url);
    newMembershipEditor.role.sendKeys('developer');
    expect(newMembershipEditor.add.getAttribute('disabled')).not.toBeNull();
  });

  it('should allow adding a new membership if both team and role are set', function() {
    var teamDescription = makeTeamDescription(0);
    await(function() {
      return client.createTeam(teamDescription);
    });

    browser.get(url);
    newMembershipEditor.name.sendKeys('a');
    newMembershipEditor.nameDropdownItem(0).click();
    newMembershipEditor.role.sendKeys('developer');
    expect(newMembershipEditor.add.getAttribute('disabled')).toBeNull();

    newMembershipEditor.add.click();

    expect(membershipListEditor.membershipCount()).toBe(1);
    expect(membershipListEditor.membership(0)).toBeDefined();
    expect(membershipListEditor.name(0).getText()).toBeDefined();
    expect(membershipListEditor.role(0).getText()).toBeDefined();
    expect(membershipListEditor.remove(0)).toBeDefined();
  });

  it('should allow removing an existing membership', function() {
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
  });
};
