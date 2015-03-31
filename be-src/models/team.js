module.exports = function(Sequelize) {
  return function(sequelize) {
    return sequelize.define('Team', {
      name: Sequelize.STRING
    });
  };
};
