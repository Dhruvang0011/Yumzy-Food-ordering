const express = require("express");
const router = express.Router();
const {authenticateUser} = require("../middleware/auth")
const {authorizeRoles} = require("../middleware/role")
const {
    getRestaurant,
    createRestaurant,
    restaurantStats,
    updateRestaurant
} = require("../controllers/restaurantOwnerController");

const {addDish,updateDish,deleteDish} = require("../controllers/dishController");
const { getRestaurantOrders,updateOrderStatus } = require("../controllers/orderController");
const { getownerProfile,updateownerProfile} = require("../controllers/userController")

router.get(
  "/my-restaurant",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  getRestaurant
);

router.post(
  "/create",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  createRestaurant
);

router.get(
  "/stats",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  restaurantStats
)

router.patch(
  "/update",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  updateRestaurant
);

router.post(
  "/add-dish",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  addDish
);

router.patch(
  "/update-dish",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  updateDish
);

router.delete(
  "/delete-dish",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  deleteDish
);

router.get(
  "/getOrder",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  getRestaurantOrders
);

router.patch(
  "/updateOrderStatus",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  updateOrderStatus
);

router.get(
  "/getprofile",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  getownerProfile,
)

router.patch(
  "/updateOwner",
  authenticateUser,
  authorizeRoles("restaurantOwner"),
  updateownerProfile,
)

module.exports = router;


