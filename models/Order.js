module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Order", {
    status: {
      type: DataTypes.ENUM("pending", "preparing", "delivered", "canceled"),
      defaultValue: "pending",
    },
  });
};
