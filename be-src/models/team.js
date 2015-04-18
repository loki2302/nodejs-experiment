module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Team', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Team name should not be empty'
        }
      }
    },
    avatar: Sequelize.STRING,
    url: Sequelize.STRING,
    slogan: Sequelize.STRING
  });
};
