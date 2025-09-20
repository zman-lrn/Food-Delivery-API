const express = require("express");
const router = express.Router();
const restaurantController = require("../controller/restaurantController");
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");

router.post(
  "/",
  authenticate,
  authorize(["admin"]),
  restaurantController.createRestaurant
);

router.get("/", cacheMiddleware, restaurantController.getAllRestaurants);
router.get("/:id", cacheMiddleware, restaurantController.getRestaurantById);

router.patch(
  "/:id",
  authenticate,
  authorize(["admin"]),
  restaurantController.updateRestaurant
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  restaurantController.deleteRestaurant
);
/**
 * @swagger
 * tags:
 *   name: Restaurants
 *   description: Endpoints for managing restaurants
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Pizza Palace"
 *         address:
 *           type: string
 *           example: "123 Main St"
 *         phone:
 *           type: string
 *           example: "+123456789"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Restaurant not found"
 */

/**
 * @swagger
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant (admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Pizza Palace"
 *               address:
 *                 type: string
 *                 example: "123 Main St"
 *               phone:
 *                 type: string
 *                 example: "+123456789"
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Restaurant'
 */

/**
 * @swagger
 * /restaurants/{id}:
 *   get:
 *     summary: Get a restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /restaurants/{id}:
 *   patch:
 *     summary: Update a restaurant (admin only)
 *     tags: [Restaurants]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Name"
 *               address:
 *                 type: string
 *                 example: "456 Another St"
 *               phone:
 *                 type: string
 *                 example: "+987654321"
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete a restaurant (admin only)
 *     tags: [Restaurants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Restaurant ID
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "restaurant deleted"
 *       404:
 *         description: Restaurant not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

module.exports = router;
