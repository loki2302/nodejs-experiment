module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Membership', {
    role: Sequelize.STRING
  });
};
