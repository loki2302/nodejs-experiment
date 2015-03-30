module.exports = function(Sequelize) {
  var sequelize = new Sequelize('sqlite://my.db');

  var Note = sequelize.define('Note', {
    content: Sequelize.STRING
  });

  var Category = sequelize.define('Category', {
    name: Sequelize.STRING
  });

  Note.belongsToMany(Category);
  Category.belongsToMany(Note, { constraints: false });

  return sequelize;
};
