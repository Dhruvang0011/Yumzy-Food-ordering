const express = require("express");
const router = express.Router();
const {authenticateUser} = require("../middleware/auth")
const {authorizeRoles} = require("../middleware/role")
const {
    createOwner,
    getOwners,
    deleteOwner,
    stats,
    getresto,
    approveRestaurants,
    deleteRestro,
    blockrestro,
    unblockRestro,
    getoders,
    getUsers
} = require("../controllers/adminController");

router.post(
  "/create-owner",
  authenticateUser,
  authorizeRoles("admin"),
  createOwner
);

router.get(
  "/owners",
  authenticateUser,
  authorizeRoles("admin"),
  getOwners
);

router.delete(
  "/owners/delete",
  authenticateUser,
  authorizeRoles("admin"),
  deleteOwner
);

router.get(
  "/stats",
  authenticateUser,
  authorizeRoles("admin"),
  stats
);

router.get(
  "/restaurants",
  authenticateUser,
  authorizeRoles("admin"),
  getresto,
);

router.patch(
  "/restaurants/approve",
  authenticateUser,
  authorizeRoles("admin"),
  approveRestaurants
);

router.patch(
  "/restaurants/block",
  authenticateUser,
  authorizeRoles("admin"),
  blockrestro
);

router.patch(
  "/restaurants/unblock",
  authenticateUser,
  authorizeRoles("admin"),
  unblockRestro
);

router.delete(
  "/restaurants/delete",
  authenticateUser,
  authorizeRoles("admin"),
  deleteRestro
)

router.get(
  "/orders",
  authenticateUser,
  authorizeRoles("admin"),
  getoders
)

router.get(
  "/users",
  authenticateUser,
  authorizeRoles("admin"),
  getUsers
)
module.exports = router;


