# todo

tbTeamEditor tests

CODE ONLY:

+It should throw when submitTitle is not set
+It should throw when teamTemplate is not set
+It should publish the "team" on a scope
+It should publish the "newMember" on a scope
+It should publish the "submitTeam" on a scope
+It should publish the "removeMember" on a scope
+It should publish the "searchPeople" on a scope
+It should publish the "canAddMember" on a scope
+It should publish the "addMember" on a scope

submitTeam
  +it should call on-submit
  +it should reload the team from teamTemplate
  +it should handle validation errors, if on-submit returns them

searchPeople
  it should call on-person-lookup
  when on-person-lookup succeeds, it should return the result
  when on-person-lookup fails, it should return an empty collection

canAddMember
  it should return false if newMember is not set
  it should return false if newMember.person is not set
  it should return false if newMember.role is not set
  it should return true if newMember has everything set up

addMember
  it should throw if canAddMember() returns false
  it should append a new member to the list of members
  it should clean up the current new member

removeMember
  it should throw if member is not on the list
  it should remove the member if it's on the list
