module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Team', {
    name: Sequelize.STRING
  });
};
