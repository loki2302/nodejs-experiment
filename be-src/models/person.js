module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Person', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Person name should not be empty'
        }
      }
    },
    position: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    phone: Sequelize.STRING,
    avatar: Sequelize.STRING,
    email: Sequelize.STRING
  });
};
