module.exports = function(Sequelize, connectionString) {
  return new Sequelize(connectionString);
};
