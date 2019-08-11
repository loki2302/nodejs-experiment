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
    url: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'URL should be a valid URL'
        }
      }
    },
    slogan: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Slogan should not be empty'
        }
      }
    }
  }, {
    hooks: {
      beforeValidate: function(team, options, fn) {
        team.name = team.name || '';
        team.url = team.url || '';
        team.slogan = team.slogan || '';
        fn(null, team);
      }
    }
  });
};
