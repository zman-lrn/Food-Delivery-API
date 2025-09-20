const { errorHandler, notFound } = require("./middleware/errorHandler");
const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.json());

const swagger = require("./swagger/swagger");

app.use("/auth", require("./route/authRoutes"));
app.use("/users", require("./route/userRoutes"));
app.use("/restaurants", require("./route/restaurantRoutes"));
app.use("/", require("./route/menuRoutes"));
app.use("/orders", require("./route/orderRoutes"));
swagger(app);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
