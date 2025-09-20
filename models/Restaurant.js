module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Restaurant", {
    name: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
  });
};
