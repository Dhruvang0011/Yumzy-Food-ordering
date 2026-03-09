const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurants")
const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const createOrderFromCart = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address required" });
    }

    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.dish");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subtotal = 0;

    const orderItems = cart.items.map((item) => {
      const itemSubtotal = item.quantity * item.dish.price;
      subtotal += itemSubtotal;

      return {
        dish: item.dish._id,
        name: item.dish.name, // snapshot
        quantity: item.quantity,
        price: item.dish.price,
        subtotal: itemSubtotal
      };
    });

    const gstRate = 0.05;
    const deliveryCharge = subtotal > 200 ? 0 : 40;

    const gst = Number((subtotal * gstRate).toFixed(2));
    const totalAmount = Number(
      (subtotal + gst + deliveryCharge).toFixed(2)
    );

    const restaurantId = cart.items[0].dish.restaurant;

    const order = await Order.create({
      user: req.user.id,
      restaurant: restaurantId,
      items: orderItems,
      pricing: {
        subtotal,
        gst,
        deliveryCharge,
        totalAmount
      },
      address
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("restaurant", "name")
      .populate("items.dish", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Order cannot be cancelled now"
      });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRestaurantOrders = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // find owner's restaurant
    const restaurant = await Restaurant.findOne({ owner: ownerId });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // get orders that are PAID and NOT CANCELLED
    const orders = await Order.find({
      restaurant: restaurant._id,
      paymentStatus: "paid",
      status: { $ne: "cancelled" }, // 🔥 exclude cancelled orders
    })
      .populate("user", "name email")
      .populate("items.dish", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};


const updateOrderStatus = async (req, res) => {
const { orderId, status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order" });
  }
};

const deleteOrder = async(req,res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order" });
  }
}


const createRazorpayOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    

const order = await Order.findById(orderId);

if (!order) {
  return res.status(404).json({ message: "Order not found" });
}

const options = {
  amount: order.pricing.totalAmount * 100,
  currency: "INR",
  receipt: "receipt_" + order._id,
};

const razorpayOrder = await razorpay.orders.create(options);

res.status(200).json({
  razorpayOrder,
});
  } catch (error) {
  console.log("RAZORPAY ERROR:", error);
  res.status(500).json({
    message: error.message,
    fullError: error
  });

  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId   // your DB order id
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      // ✅ Update order as paid
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid"
      });

      res.status(200).json({ message: "Payment verified successfully" });

    } else {
      res.status(400).json({ message: "Invalid signature" });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrderFromCart,
  getMyOrders,
  cancelOrder,
  getRestaurantOrders,
  updateOrderStatus,
  createRazorpayOrder,
  verifyPayment,
  deleteOrder
};