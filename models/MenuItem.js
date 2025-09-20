module.exports = (sequelize, DataTypes) => {
  return sequelize.define("MenuItem", {
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
  });
};
