const express = require("express");
const router = express.Router();
const {
  addToCart,
  updateCartItem,
  getUserCart,
  clearCart
} = require("../controllers/cartController");

const { authenticateUser } = require("../middleware/auth");

router.post("/add", authenticateUser, addToCart);
router.patch("/update", authenticateUser, updateCartItem);
router.get("/", authenticateUser, getUserCart);
router.delete("/clear", authenticateUser, clearCart);

module.exports = router;