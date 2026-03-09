const express = require("express");
const router = express.Router();

const {
  createOrderFromCart,
  getMyOrders,
  cancelOrder,
  updateOrderStatus,
  createRazorpayOrder,
  deleteOrder,
  verifyPayment
} = require("../controllers/orderController");

const { authenticateUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/role");

// ================= USER ROUTES =================

// Create order from cart
router.post("/create", authenticateUser, createOrderFromCart);

// Get my orders
router.get("/my-orders", authenticateUser, getMyOrders);

// Cancel order
router.put("/cancel/:orderId", authenticateUser, cancelOrder);

// Create Razorpay order
router.post("/payment/create", authenticateUser, createRazorpayOrder);

// Verify Razorpay payment
router.post("/payment/verify", authenticateUser, verifyPayment);

router.delete("/:id",authenticateUser,deleteOrder)

// ================= RESTAURANT OWNER ROUTES =================

// Get restaurant paid orders


// Update order status


module.exports = router;