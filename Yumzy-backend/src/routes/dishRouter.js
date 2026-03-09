const express = require("express");
const router = express.Router();

const {
  getRestaurantDishes,
} = require("../controllers/dishController");

// Public
router.get("/:restaurantId", getRestaurantDishes);

module.exports = router;