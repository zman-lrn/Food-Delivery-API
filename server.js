const app = require("./app");
const { sequelize } = require("./config/db");

const PORT = process.env.PORT || 3000;

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
