module.exports = function() {
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
      this.status = 404;
      this.body = makeNotFoundDTO('Note', id);
    };

    this.categoryNotFound = function(id) {
      this.status = 404;
      this.body = makeNotFoundDTO('Category', id);
    };

    this.badRequest = function(message) {
      this.status = 400;
      this.body = makeMessageDTO(message);
    };

    this.conflict = function(message) {
      this.status = 409;
      this.body = makeMessageDTO(message);
    };

    this.validationError = function(error) {
      var errorMap = {};
      error.errors.forEach(function(e) {
        errorMap[e.path] = e.message;
      });

      this.status = 400;
      this.body = errorMap;
    };

    yield next;
  };
};
