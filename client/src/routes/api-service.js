angular.module("api", ["resources.notes", "resources.categories"])
.service("apiService", ["$q", "Note", "Category", function($q, Note, Category) {
	this.ValidationError = function ValidationError(errorMap) {
		this.errorMap = errorMap;
	};

	this.ConnectivityError = function ConnectivityError(message) {
		this.message = message;
	};

	this.UnexpectedError = function UnexpectedError(message) {
		this.message = message;
	};

	var self = this;
	function makeRejectionFromResponse(httpResponse) {
		var httpStatus = httpResponse.status;
		if(httpStatus === 400) {
			return $q.reject(new self.ValidationError(httpResponse.data));
		}

		if(httpStatus === 0) {
			return $q.reject(new self.ConnectivityError(httpResponse.data.message));
		}

		return $q.reject(new self.UnexpectedError(httpResponse.data.message));
	};

	this.createNote = function(note) {
		return Note.save({
			content: note.content
		}).$promise.then(function(note) {
			return note;
		}, function(httpResponse) {
			return makeRejectionFromResponse(httpResponse);
		});
	};

	this.updateNote = function(note) {
		return Note.save({
			id: note.id,
			content: note.content
		}).$promise.then(function(note) {
			return note;
		}, function(httpResponse) {
			return makeRejectionFromResponse(httpResponse);
		});
	};

	this.deleteNote = function(note) {
		return Note.delete({
			id: note.id
		}).$promise.then(function() {			
		}, function(httpResponse) {
			return makeRejectionFromResponse(httpResponse);
		});
	};

	this.getNotes = function() {
		return Note.query();
	};
}]);