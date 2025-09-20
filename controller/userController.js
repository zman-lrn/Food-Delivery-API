const { User } = require("../models");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "role"] },
    });
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "role"] },
    });
    if (!user) return res.status(404).json({ message: "user not found" });
    await user.update(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    await user.destroy();
    res.json({ message: "user deleted" });
  } catch (error) {
    next(error);
  }
};
