module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define("Address", {
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
  });

  Address.associate = (models) => {
    Address.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return Address;
};
