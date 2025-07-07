module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("Category", {
    name: DataTypes.STRING,
    product: DataTypes.INTEGER,
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    offer: DataTypes.STRING,
    description: DataTypes.TEXT,
  });

  Category.associate = (models) => {
    Category.hasMany(models.Product, {
      foreignKey: "categoryId",
      as: "products",
    });
  };

  return Category;
};
