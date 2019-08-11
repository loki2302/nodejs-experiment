module.exports = function() {
  
  function RestError(status, body) {
    this.status = status;
    this.body = body;
  };
  RestError.prototype = new Error();
  RestError.prototype.constructor = RestError;

  function makeNoteDTO(note) {
    return {
      id: note.id,
      content: note.content,
      categories: note.Categories
    };
  };

  function makeNoteDTOs(notes) {
    return notes.map(makeNoteDTO);
  };

  function makeMessageDTO(message) {
    return { 'message': message };
  }

  function makeNotFoundDTO(entity, id) {
    return makeMessageDTO(entity + ' ' + id + ' not found');
  };  

  return function* (next) {
    this.ok = function(message) {
      this.status = 200;
      this.body = makeMessageDTO(message);
    };

    this.okNoteCollection = function(notes) {
      this.status = 200;
      this.body = makeNoteDTOs(notes);
    };

    this.okCategoryCollection = function(categories) {
      this.status = 200;
      this.body = categories;
    };

    this.okNote = function(note) {
      this.status = 200;
      this.body = makeNoteDTO(note);
    };

    this.okCategory = function(category) {
      this.status = 200;
      this.body = category;
    };

    this.createdNote = function(note) {
      this.status = 201;
      this.body = makeNoteDTO(note);
    };

    this.createdCategory = function(category) {
      this.status = 201;
      this.body = category;
    };

    this.noteNotFound = function(id) {
      throw new RestError(404, makeNotFoundDTO('Note', id));
    };

    this.categoryNotFound = function(id) {
      throw new RestError(404, makeNotFoundDTO('Category', id));
    };

    this.badRequest = function(message) {
      throw new RestError(400, makeMessageDTO(message));
    };

    this.validationErrorFromSequelizeValidationError = function(error) {
      var errorMap = {};
      error.errors.forEach(function(e) {
        errorMap[e.path] = e.message;
      });

      this.validationError(errorMap);
    };

    this.validationError = function(errorMap) {
      throw new RestError(400, errorMap);
    };

    try {
      yield next;
    } catch(e) {
      if(e instanceof RestError) {
        this.status = e.status;
        this.body = e.body;
      } else {
        this.status = 500;
        this.body = makeMessageDTO('Internal error');
      }
    }
  };
};
