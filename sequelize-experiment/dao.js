var Sequelize = require("sequelize");

var DAO = function() {
	this.sequelize = new Sequelize('database', 'username', 'password', {
	  dialect: 'sqlite',
	  storage: 'my.db'
	});

	this.Note = this.sequelize.define('Note', {
	  title: Sequelize.STRING,
	  description: Sequelize.TEXT
	});
};

DAO.prototype.initialize = function(success, error) {
	this.sequelize.sync().success(function() {
		success();
	}).error(function(e) {
		error(e);
	});
};

DAO.prototype.drop = function(success, error) {
	this.sequelize.drop().success(function() {
		success();
	}).error(function(e) {
		error(e);
	});
};

DAO.prototype.getAllNotes = function(success, error) {
	this.Note.all().success(function(notes) {
		success(notes);
	}).error(function(e) {
		error(e);
	});
};

DAO.prototype.getNote = function(noteId, success, error) {
	this.Note.find(noteId).success(function(note) {
		success(note);
	}).error(function(e) {
		error(e);
	});
};

DAO.prototype.createNote = function(fields, success, error) {	
	this.Note.create(fields).success(function(note) {
		success(note);
	}).error(function(e) {
		error(e);
	});
};

exports.DAO = DAO;