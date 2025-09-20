const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: false,
  }
);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

const { User, Restaurant, MenuItem, Order, OrderItem } = db;

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Restaurant.hasMany(MenuItem, { foreignKey: "restaurantId" });
Restaurant.hasMany(Order, { foreignKey: "restaurantId" });
MenuItem.belongsTo(Restaurant, { foreignKey: "restaurantId" });

Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

MenuItem.hasMany(OrderItem, { foreignKey: "menuItemId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
