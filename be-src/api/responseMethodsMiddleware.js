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
        this.body = 'internal server error ' + e;
      }
    }
  };

  function makeBriefPersonDTOs(people) {
    return people.map(makeBriefPersonDTO);
  }

  function makeBriefPersonDTO(person) {
    return {
      id: person.id,
      name: person.name
    };
  }

  function makeCompletePersonDTOs(people) {
    return people.map(makeCompletePersonDTO);
  }

  function makeCompletePersonDTO(person) {
    return {
      id: person.id,
      name: person.name,
      memberships: makeBriefMembershipDTOs(person.Memberships)
    };
  }

  function makeBriefMembershipDTOs(memberships) {
    return memberships.map(makeBriefMembershipDTO);
  }

  function makeBriefMembershipDTO(membership) {
    return {
      team: {
        id: membership.id, // is it actually teamId or not?
        name: membership.name
      },
      role: membership.Membership.role
    };
  }

  function makeBriefTeamDTOs(teams) {
    return teams.map(makeBriefTeamDTO);
  }

  function makeBriefTeamDTO(team) {
    return {
      id: team.id,
      name: team.name
    };
  }

  function makeCompleteTeamDTOs(teams) {
    return teams.map(makeCompleteTeamDTO);
  }

  function makeCompleteTeamDTO(team) {
    return {
      id: team.id,
      name: team.name,
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
        name: member.name
      },
      role: member.Membership.role
    };
  }
};
