const express = require("express");
const router = express.Router();
const {
  createMenuItem,
  getMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require("../controller/menuItemController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.post(
  "/restaurants/:id/menu",
  authenticate,
  authorize(["admin"]),
  createMenuItem
);
router.get("/restaurants/:id/menu", getMenuItems);
router.get("/menu/:id", getMenuItemById);
router.patch("/menu/:id", authenticate, authorize(["admin"]), updateMenuItem);
router.delete("/menu/:id", authenticate, authorize(["admin"]), deleteMenuItem);
/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: managing and retrieving restaurant menu items
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
 *           example: "Pizza"
 *         price:
 *           type: number
 *           example: 10.5
 *         restaurantId:
 *           type: integer
 *           example: 1
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Restaurant not found"
 */

/**
 * @swagger
 * /restaurants/{id}/menu:
 *   post:
 *     summary: Create a new menu item for a restaurant (admin only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Restaurant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Margherita Pizza"
 *               price:
 *                 type: number
 *                 example: 10.5
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /restaurants/{id}/menu:
 *   get:
 *     summary: Get all menu items for a restaurant
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: List of menu items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MenuItem'
 */

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Get a menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /menu/{id}:
 *   patch:
 *     summary: Update a menu item (admin only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Menu item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pepperoni Pizza"
 *               price:
 *                 type: number
 *                 example: 12.5
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete a menu item (admin only)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Menu item ID
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "MenuItem deleted"
 *       404:
 *         description: Menu item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

module.exports = router;
