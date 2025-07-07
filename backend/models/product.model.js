module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    title: DataTypes.STRING,
    image: DataTypes.STRING,
    offer: DataTypes.STRING,
    quantity: DataTypes.JSON, 
    stock: DataTypes.INTEGER,
    tagName: DataTypes.STRING,
    description: DataTypes.TEXT,
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, {
      foreignKey: "categoryId",
      as: "category",
    });
  };

  return Product;
};
