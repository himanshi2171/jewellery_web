const Sequelize = require("sequelize");
const sequelize = new Sequelize("myDB", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    socketPath: "/opt/lampp/var/mysql/mysql.sock",
  },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Category = require("../models/category.model")(sequelize, Sequelize);
db.Product = require("../models/product.model")(sequelize, Sequelize);
db.User = require("../models/user.model")(sequelize, Sequelize);
db.Address = require("../models/address.model")(sequelize, Sequelize);
db.Order = require("../models/order.model")(sequelize, Sequelize);

db.Category.hasMany(db.Product, { as: "products", foreignKey: "categoryId" });
db.Product.belongsTo(db.Category, { foreignKey: "categoryId", as: "category" });
db.User.hasMany(db.Address, {
  foreignKey: "userId",
  as: "addresses",
});
db.Address.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});
db.Order.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});
db.Order.belongsTo(db.Address, {
  foreignKey: "addressId",
  as: "shippingAddress",
});
db.Order.hasMany(db.Product, {
  foreignKey: "orderId",
  as: "products",
});

module.exports = db;
