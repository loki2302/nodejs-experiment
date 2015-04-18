var co = require('co');

module.exports = function(Q, Person, Team, faker, gravatar) {
  var NUMBER_OF_PEOPLE = 30;
  var NUMBER_OF_TEAMS = 10;
  var MIN_TEAM_SIZE = 0;
  var MAX_TEAM_SIZE = 10;

  var ROLES = [
    'Developer',
    'QA',
    'Manager',
    'Designer'
  ];

  var POSITION_PREFIXES = [
    'Experienced',
    ''
  ];

  var POSITIONS = [
    'web hacker',
    'back-end developer',
    'front-end developer',
    'AngularJS fan',
    'QA engineer',
    'designer'
  ];

  return function() {
    return co(function* () {
      var personIds = [];
      for(var i = 0; i < NUMBER_OF_PEOPLE; ++i) {
        var person = yield Person.create({
          name: faker.name.findName(),
          city: faker.address.city(), // 'South Alycemouth'
          state: faker.address.stateAbbr(), // 'NY'
          phone: faker.phone.phoneNumber(), // '1-234-655-2694 x907'
          avatar: faker.internet.avatar(), // 'https://s3.amazonaws.com/uifaces/faces/twitter/naupintos/128.jpg'
          email: faker.internet.email(), // 'Beryl.Buckridge@hotmail.com'
          position: faker.random.array_element(POSITION_PREFIXES) + ' ' + faker.random.array_element(POSITIONS)
        });
        personIds.push(person.id);
      }

      var teamIds = [];
      for(var i = 0; i < NUMBER_OF_TEAMS; ++i) {
        var companyName = faker.company.companyName();
        var team = yield Team.create({
          name: companyName,
          avatar: gravatar.url(companyName, {size: 128, default: 'retro'}, false)
        });
        teamIds.push(team.id);
      }

      for(var i = 0; i < teamIds.length; ++i) {
        var teamId = teamIds[i];
        var teamCandidateIds = personIds.slice(0);
        var teamSize = Math.floor(MIN_TEAM_SIZE + Math.random() * (MAX_TEAM_SIZE - MIN_TEAM_SIZE));

        var team = yield Team.find(teamId);
        for(var j = 0; j < teamSize; ++j) {
          var randomCandidateIndex = Math.floor(Math.random() * teamCandidateIds.length);
          var personId = teamCandidateIds[randomCandidateIndex];
          var person = yield Person.find(personId);

          var randomRoleIndex = Math.floor(Math.random() * ROLES.length);
          var role = ROLES[randomRoleIndex];

          yield team.addMember(person, { role: role });
          teamCandidateIds.splice(randomCandidateIndex, 1);
        }
      }
    });
  };
};
