module.exports = function NewMemberEditor() {
  this.name = element(by.css('#new-member-name'));
  this.nameDropdown = element(by.css('ul.dropdown-menu'));
  this.role = element(by.css('#new-member-role'));
  this.add = element(by.css('#add-member-button'));

  var self = this;
  this.nameDropdownItem = function(index) {
    return self.nameDropdown.all(by.css('li')).get(index);
  };
};
