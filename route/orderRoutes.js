const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/orderController");
const {
  getOrderItems,
  updateOrderItem,
  deleteOrderItem,
} = require("../controller/orderItemController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post("/", authenticate, authorize(["customer", "user"]), createOrder);
router.get("/", authenticate, getOrders);
router.get("/:id", authenticate, getOrderById);
router.patch(
  "/:id/status",
  authenticate,
  authorize(["admin"]),
  updateOrderStatus
);
router.delete("/:id", authenticate, deleteOrder);

// Order items
router.get("/:id/items", authenticate, getOrderItems);
router.patch(
  "/:id/items/:itemId",
  authenticate,
  authorize(["customer"]),
  updateOrderItem
);

router.delete(
  "/:id/items/:itemId",
  authenticate,
  authorize(["customer"]),
  deleteOrderItem
);
/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: managing orders and order items
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Margherita Pizza"
 *         price:
 *           type: number
 *           example: 10.5
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 2
 *         menuItem:
 *           $ref: '#/components/schemas/MenuItem'
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           example: pending
 *         userId:
 *           type: integer
 *           example: 1
 *         restaurantId:
 *           type: integer
 *           example: 1
 *         OrderItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Order not found"
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurantId
 *               - items
 *             properties:
 *               restaurantId:
 *                 type: integer
 *                 example: 1
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - menuItemId
 *                     - quantity
 *                   properties:
 *                     menuItemId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders for the authenticated user or admin
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       403:
 *         description: Forbidden (access denied)
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, preparing, delivered, canceled]
 *                 example: delivered
 *     responses:
 *       200:
 *         description: Order status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order status updated successfully"
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "order cancelled"
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{id}/items:
 *   get:
 *     summary: Get all items in an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: List of order items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderItem'
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{id}/items/{itemId}:
 *   patch:
 *     summary: Update an order item (customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *     responses:
 *       200:
 *         description: Order item updated successfully
 *       400:
 *         description: Order cannot be modified
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order or item not found
 */

/**
 * @swagger
 * /orders/{id}/items/{itemId}:
 *   delete:
 *     summary: Delete an order item (customer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *       - in: path
 *         name: itemId
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order item ID
 *     responses:
 *       200:
 *         description: Order item deleted successfully
 *       400:
 *         description: Order cannot be modified
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order or item not found
 */

module.exports = router;
