const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;

    req.isAdmin = () => req.user.role === "admin";
    req.isSelf = (id) => req.user.id === parseInt(id, 10);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
