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

db.Category.hasMany(db.Product, { as: "products", foreignKey: "categoryId" });
db.Product.belongsTo(db.Category, { foreignKey: "categoryId", as: "category" });
db.User.hasMany(db.Address, {
  as: "addresses",
  foreignKey: "userId",
});
db.Address.belongsTo(db.User, {
  foreignKey: "userId",
  as: "user",
});

module.exports = db;
