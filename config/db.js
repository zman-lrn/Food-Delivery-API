const { Sequelize, DataTypes } = require("sequelize");
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

const User = require("../models/User")(sequelize, DataTypes);
const Restaurant = require("../models/Restaurant")(sequelize, DataTypes);
const MenuItem = require("../models/MenuItem")(sequelize, DataTypes);
const Order = require("../models/Order")(sequelize, DataTypes);
const OrderItem = require("../models/OrderItem")(sequelize, DataTypes);

module.exports = { sequelize, User, Restaurant, MenuItem, Order, OrderItem };
