const { Restaurant, MenuItem } = require("../models");

exports.createRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.getAllRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.findAll();
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: MenuItem,
    });
    if (!restaurant)
      return res.status(404).json({ message: "restaurant not found" });
    res.json(restaurant.toJSON());
  } catch (error) {
    next(error);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "restaurant not found" });
    await restaurant.update(req.body);
    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

exports.deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "restaurant not found" });
    await restaurant.destroy();
    res.json({ message: "restaurant deleted" });
  } catch (error) {
    next(error);
  }
};
