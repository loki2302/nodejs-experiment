module.exports = function(RESTError) {
  return function* (next) {
    this.ok = function(data) {
      this.status = 200;
      this.body = data;
    };

    this.badRequest = function(data) {
      throw new RESTError(400, data);
    };

    this.createdPerson = function(person) {
      this.status = 201;
      this.body = makeCompletePersonDTO(person);
    };

    this.validationErrorFromSequelizeValidationError = function(sequelizeValidationError) {
      var errorMap = {};
      error.errors.forEach(function(fieldError) {
        errorMap[fieldError.path] = fieldError.message;
      });

      this.validationError(errorMap);
    };

    this.validationError = function(errorMap) {
      throw new RESTError(400, errorMap);
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
      /* TODO: what do I put here? */
    };
  }
};
