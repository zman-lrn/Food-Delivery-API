const { Order, OrderItem, MenuItem, Restaurant } = require("../models");

exports.createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items } = req.body;

    if (!items || !items.length)
      return res.status(400).json({ message: "Order must have items" });

    if (!restaurantId)
      return res.status(400).json({ message: "restaurantId is required" });

    // ✅ Check if restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurant not found" });

    const order = await Order.create({
      userId: req.user.id,
      restaurantId,
    });

    await Promise.all(
      items.map((item) =>
        OrderItem.create({
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })
      )
    );

    const fullOrder = await Order.findByPk(order.id, {
      include: { model: OrderItem, include: MenuItem },
    });

    res.status(201).json(fullOrder);
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const where = req.user.role === "admin" ? {} : { userId: req.user.id };
    const orders = await Order.findAll({
      where,
      include: {
        model: OrderItem,
        include: MenuItem,
      },
    });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: { model: OrderItem, include: MenuItem },
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.userId !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    res.json(order);
  } catch (error) {
    next(error);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "order not found" });

    if (req.user.role !== "admin" && order.userId !== req.user.id)
      return res.status(403).json({ message: "forbidden" });

    if (req.user.role !== "admin" && order.status !== "pending")
      return res.status(400).json({
        message:
          "cannot delete order that is not pending it already in preparation",
      });

    await order.destroy();
    res.json({ message: "order cancelled" });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "preparing", "delivered", "canceled"];
    if (!allowedStatuses.includes(status))
      return res.status(400).json({ error: "Invalid status value" });

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};
