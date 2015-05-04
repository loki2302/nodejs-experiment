var NewMemberEditor = require('./newMemberEditor.js');
var MemberListEditor = require('./memberListEditor.js');

module.exports = function TeamEditor() {
  // TODO: clean up - extract the schema somehow and reuse it for all actions

  this.name = element(by.css('.name input'));
  this.nameError = element(by.css('.name p'));

  this.slogan = element(by.css('.slogan input'));
  this.sloganError = element(by.css('.slogan p'));

  this.url = element(by.css('.url input'));
  this.urlError = element(by.css('.url p'));

  var self = this;
  this.clearAll = function() {
    self.name.clear();
    self.slogan.clear();
    self.url.clear();
  };

  this.setFromDescription = function(description) {
    self.name.clear().sendKeys(description.name);
    self.slogan.clear().sendKeys(description.slogan);
    self.url.clear().sendKeys(description.url);
  };

  this.expectMatchDescription = function(description) {
    expect(self.name.getAttribute('value')).toBe(description.name);
    expect(self.slogan.getAttribute('value')).toBe(description.slogan);
    expect(self.url.getAttribute('value')).toBe(description.url);
  };

  this.expectAllFieldsEmpty = function() {
    expect(self.name.getText()).toBe('');
    expect(self.slogan.getText()).toBe('');
    expect(self.url.getText()).toBe('');
  };

  this.expectAllFieldsInError = function() {
    expect(self.nameError.isPresent()).toBe(true);
    expect(self.sloganError.isPresent()).toBe(true);
    expect(self.urlError.isPresent()).toBe(true);
  };

  this.newMemberEditor = new NewMemberEditor();
  this.memberListEditor = new MemberListEditor();
};
