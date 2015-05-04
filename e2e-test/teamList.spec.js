var TeamListPage = function() {
  this.addTeam = element(by.css('#addTeam'));
};

describeTeambuildr('TeamList', function() {
  var teamListPage;
  beforeEach(function() {
    teamListPage = new TeamListPage();
  });

  it('should have an "Add Team" link', function() {
    browser.get('/teams');
    expect(teamListPage.addTeam.isPresent()).toBe(true);
  });
});
