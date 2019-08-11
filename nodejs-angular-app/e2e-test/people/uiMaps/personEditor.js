var NewMembershipEditor = require('./newMembershipEditor.js');
var MembershipListEditor = require('./membershipListEditor.js');

module.exports = function PersonEditor() {
  // TODO: clean up - extract the schema somehow and reuse it for all actions

  this.name = element(by.css('.name input'));
  this.nameError = element(by.css('.name p'));

  this.avatar = element(by.css('.avatar img'));
  this.randomizeAvatar = element(by.css('.avatar button'));

  this.position = element(by.css('.position input'));
  this.positionError = element(by.css('.position p'));

  this.city = element(by.css('.city input'));
  this.cityError = element(by.css('.city p'));

  this.state = element(by.css('.state input'));
  this.stateError = element(by.css('.state p'));

  this.phone = element(by.css('.phone input'));
  this.phoneError = element(by.css('.phone p'));

  this.email = element(by.css('.email input'));
  this.emailError = element(by.css('.email p'));

  var self = this;
  this.clearAll = function() {
    self.name.clear();
    self.position.clear();
    self.city.clear();
    self.state.clear();
    self.phone.clear();
    self.email.clear();
  };

  this.setFromDescription = function(description) {
    self.name.clear().sendKeys(description.name);
    self.position.clear().sendKeys(description.position);
    self.city.clear().sendKeys(description.city);
    self.state.clear().sendKeys(description.state);
    self.phone.clear().sendKeys(description.phone);
    self.email.clear().sendKeys(description.email);
  };

  this.expectMatchDescription = function(description) {
    expect(self.name.getAttribute('value')).toBe(description.name);
    expect(self.position.getAttribute('value')).toBe(description.position);
    expect(self.city.getAttribute('value')).toBe(description.city);
    expect(self.state.getAttribute('value')).toBe(description.state);
    expect(self.phone.getAttribute('value')).toBe(description.phone);
    expect(self.email.getAttribute('value')).toBe(description.email);
  };

  this.expectAllFieldsEmpty = function() {
    expect(self.name.getText()).toBe('');
    expect(self.position.getText()).toBe('');
    expect(self.city.getText()).toBe('');
    expect(self.state.getText()).toBe('');
    expect(self.phone.getText()).toBe('');
    expect(self.email.getText()).toBe('');
  };

  this.expectAllFieldsInError = function() {
    expect(self.nameError.isPresent()).toBe(true);
    expect(self.positionError.isPresent()).toBe(true);
    expect(self.cityError.isPresent()).toBe(true);
    expect(self.stateError.isPresent()).toBe(true);
    expect(self.phoneError.isPresent()).toBe(true);
    expect(self.emailError.isPresent()).toBe(true);
  };

  this.newMembershipEditor = new NewMembershipEditor();
  this.membershipListEditor = new MembershipListEditor();
};
