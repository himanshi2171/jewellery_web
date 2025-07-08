module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
    cartItem: DataTypes.JSON,
    phone: DataTypes.STRING,
    delivery_method: DataTypes.STRING,
    total_amount: DataTypes.DECIMAL,
    subtotal: DataTypes.DECIMAL,
    shipping: DataTypes.STRING,
    tax: DataTypes.DECIMAL,
    card: DataTypes.DECIMAL,
    expiry: DataTypes.STRING,
    cvv: DataTypes.STRING,
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });

    Order.belongsTo(models.Address, {
      foreignKey: "addressId",
      as: "shippingAddress",
    });

    Order.belongsTo(models.Address, {
      foreignKey: "productId",
      as: "products",
    });
  };

  return Order;
};
