var Sequelize = require('sequelize');

module.exports = function() {
  var sequelize = new Sequelize('sqlite://my.db');

  var Note = sequelize.define('Note', {
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Note content should not be empty'
        }
      }
    }
  });

  /* unique lowercase category name via unique index */
  /*var Category = sequelize.define('Category', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'lowercaseNameIndex',
      validate: {
        notEmpty: {
          msg: 'Category name should not be empty'
        }
      }
    }
  }, {
    indexes: [{
      name: 'lowercaseNameIndex',
      unique: true,
      fields: [{ attribute: 'name', collate: 'nocase' }]
    }]
  });*/

  /* unique lowercase category name via custom validator */
  var Category = sequelize.define('Category', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Category name should not be empty'
        },
        unique: function(value, next) {
          var whereClause;

          var lowercaseNameEqualsLowercaseValue = [ 'lower(name) = ?', value.toLowerCase() ];
          if(this.isNewRecord) {
            whereClause = lowercaseNameEqualsLowercaseValue;
          } else {
            whereClause = [
              lowercaseNameEqualsLowercaseValue,
              { 
                id: { $not: this.id } 
              }
            ];
          }

          Category.find({
            where: whereClause
          }).then(function(category) {
            if(category) {
              return next('Category name should be unique');
            }

            return next();
          }, function(error) {
            next(error);
          });
        }
      }
    }
  });

  Note.belongsToMany(Category);
  Category.belongsToMany(Note, { constraints: false });

  return {
    sequelize: sequelize,
    initialize: function() {
      return sequelize.sync();
    },
    reset: function() {
      return sequelize.drop().then(function() {
        return sequelize.sync();
      });
    }
  };
};
