const { Order, OrderItem, MenuItem } = require("../models");

exports.getOrderItems = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          include: [MenuItem],
        },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(order.OrderItems);
  } catch (error) {
    next(error);
  }
};

exports.updateOrderItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;
    const { quantity } = req.body;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be modified" });
    }

    const item = await OrderItem.findOne({
      where: { id: itemId, orderId: id },
    });
    if (!item)
      return res.status(404).json({ message: "Item not found in order" });

    item.quantity = quantity;
    await item.save();

    res.json({ message: "Order item updated", item });
  } catch (error) {
    next(error);
  }
};

exports.deleteOrderItem = async (req, res, next) => {
  try {
    const { id, itemId } = req.params;

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order cannot be modified" });
    }

    const item = await OrderItem.findOne({
      where: { id: itemId, orderId: id },
    });
    if (!item)
      return res.status(404).json({ message: "Item not found in order" });

    await item.destroy();
    res.json({ message: "Order item removed successfully" });
  } catch (error) {
    next(error);
  }
};
