const { Sequelize } = require("sequelize");
require("dotenv").config();

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

const User = require("../../models/User")(sequelize);
const Restaurant = require("../../models/Restaurant")(sequelize);
const MenuItem = require("../../models/MenuItem")(sequelize);
const Order = require("../../models/Order")(sequelize);
const OrderItem = require("../../models/OrderItem")(sequelize);

// Define relationships
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });
Restaurant.hasMany(MenuItem, { foreignKey: "restaurantId" });
Restaurant.hasMany(Order, { foreignKey: "restaurantId" });
MenuItem.belongsTo(Restaurant, { foreignKey: "restaurantId" });
Order.hasMany(OrderItem, { foreignKey: "orderId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
MenuItem.hasMany(OrderItem, { foreignKey: "menuItemId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "menuItemId" });

module.exports = { sequelize, User, Restaurant, MenuItem, Order, OrderItem };
