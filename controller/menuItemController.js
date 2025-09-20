const { MenuItem, Restaurant } = require("../models");

exports.createMenuItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const menuItem = await MenuItem.create({ ...req.body, restaurantId: id });
    res.status(201).json(menuItem);
  } catch (error) {
    next(error);
  }
};

exports.getMenuItems = async (req, res, next) => {
  try {
    const { id } = req.params;
    const items = await MenuItem.findAll({ where: { restaurantId: id } });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

exports.getMenuItemById = async (req, res, next) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "MenuItem not found" });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "MenuItem not found" });
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "MenuItem not found" });
    await item.destroy();
    res.json({ message: "MenuItem deleted" });
  } catch (error) {
    next(error);
  }
};
