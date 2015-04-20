module.exports = function(sequelize, Sequelize) {
  return sequelize.define('Team', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 30],
          msg: 'Team name should be 2 to 30 characters long'
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
        len: {
          args: [5, 50],
          msg: 'Slogan should be 5 to 50 characters long'
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
