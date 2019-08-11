module.exports = function NewMembershipEditor() {
  this.name = element(by.css('#new-membership-name'));
  this.nameDropdown = element(by.css('ul.dropdown-menu'));
  this.role = element(by.css('#new-membership-role'));
  this.add = element(by.css('#add-membership-button'));

  var self = this;
  this.nameDropdownItem = function(index) {
    return self.nameDropdown.all(by.css('li')).get(index);
  };
};
