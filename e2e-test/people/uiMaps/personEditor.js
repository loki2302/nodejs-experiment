var NewMembershipEditor = require('./newMembershipEditor.js');
var MembershipListEditor = require('./membershipListEditor.js');

module.exports = function PersonEditor() {
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

  this.newMembershipEditor = new NewMembershipEditor();
  this.membershipListEditor = new MembershipListEditor();
};
