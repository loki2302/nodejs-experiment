module.exports = function(RESTError) {
  return function* (next) {
    this.ok = function(message) {
      this.status = 200;
      this.body = {
        message: message
      };
    };

    this.badRequest = function(data) {
      throw new RESTError(400, data);
    };

    this.okPerson = function(person) {
      this.status = 200;
      this.body = makeCompletePersonDTO(person);
    };

    this.okPersonCollection = function(people) {
      this.status = 200;
      this.body = makeCompletePersonDTOs(people);
    };

    this.createdPerson = function(person) {
      this.status = 201;
      this.body = makeCompletePersonDTO(person);
    };

    this.okTeam = function(team) {
      this.status = 200;
      this.body = makeCompleteTeamDTO(team);
    };

    this.okTeamCollection = function(teams) {
      this.status = 200;
      this.body = makeCompleteTeamDTOs(teams);
    };

    this.createdTeam = function(team) {
      this.status = 201;
      this.body = makeCompleteTeamDTO(team);
    };

    this.validationErrorFromSequelizeValidationError = function(sequelizeValidationError) {
      var errorMap = {};
      sequelizeValidationError.errors.forEach(function(fieldError) {
        errorMap[fieldError.path] = fieldError.message;
      });

      this.validationError(errorMap);
    };

    this.validationError = function(errorMap) {
      throw new RESTError(400, errorMap);
    };

    this.notFoundError = function() {
      throw new RESTError(404, {});
    };

    this.personNotFound = function() {
      this.notFoundError();
    };

    this.teamNotFound = function() {
      this.notFoundError();
    };

    try {
      yield next;
    } catch(e) {
      if(e instanceof RESTError) {
        this.status = e.status;
        this.body = e.body;
      } else {
        this.status = 500;
        this.body = 'Internal Server Error: ' + e;
      }
    }
  };

  function makeCompletePersonDTOs(people) {
    return people.map(makeCompletePersonDTO);
  }

  function makeCompletePersonDTO(person) {
    return {
      id: person.id,
      name: person.name,
      position: person.position,
      city: person.city,
      state: person.state,
      phone: person.phone,
      avatar: person.avatar,
      email: person.email,
      memberships: makeBriefMembershipDTOs(person.Memberships)
    };
  }

  function makeBriefMembershipDTOs(memberships) {
    return memberships.map(makeBriefMembershipDTO);
  }

  function makeBriefMembershipDTO(membership) {
    return {
      team: {
        id: membership.id,
        name: membership.name,
        avatar: membership.avatar
      },
      role: membership.Membership.role
    };
  }

  function makeCompleteTeamDTOs(teams) {
    return teams.map(makeCompleteTeamDTO);
  }

  function makeCompleteTeamDTO(team) {
    return {
      id: team.id,
      name: team.name,
      avatar: team.avatar,
      members: makeBriefMemberDTOs(team.Members)
    };
  }

  function makeBriefMemberDTOs(members) {
    return members.map(makeBriefMemberDTO);
  }

  function makeBriefMemberDTO(member) {
    return {
      person: {
        id: member.id,
        name: member.name,
        position: member.position,
        city: member.city,
        state: member.state,
        phone: member.phone,
        avatar: member.avatar,
        email: member.email
      },
      role: member.Membership.role
    };
  }
};
