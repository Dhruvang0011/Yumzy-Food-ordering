const express = require("express");
const router = express.Router();

const {
  getAllRestaurants,
  getOneRestaurants,
} = require("../controllers/restaurantController");

const { authenticateUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");

// Public
router.get("/", getAllRestaurants);

router.get("/:id",
  authenticateUser,
  getOneRestaurants
)


module.exports = router;