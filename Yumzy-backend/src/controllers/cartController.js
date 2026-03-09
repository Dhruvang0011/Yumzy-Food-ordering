
const Cart = require("../models/Cart");
const Dish = require("../models/Dishes");

const addToCart = async (req, res) => {
  try {
    const { dishId, quantity } = req.body;

    const dish = await Dish.findById(dishId).populate("restaurant");

    if (!dish) {
      return res.status(404).json({ message: "Dish not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    // If no cart → create one
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: []
      });
    }

    if (cart.items.length > 0) {
      const existingDish = await Dish.findById(cart.items[0].dish);

      if (existingDish.restaurant.toString() !== dish.restaurant._id.toString()) {
        return res.status(400).json({
          message: "You can only add items from one restaurant at a time"
        });
      }
    }

    // Check if dish already exists
    const itemIndex = cart.items.findIndex(
      item => item.dish.toString() === dishId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        dish: dishId,
        quantity: quantity || 1
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Item added to cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateCartItem = async (req, res) => {
  try {
    const { dishId, action } = req.body; // action: "inc" or "dec"

    const cart = await Cart.findOne({ user: req.user.id });

    const item = cart.items.find(
      (item) => item.dish.toString() === dishId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (action === "inc") {
      item.quantity += 1;
    }

    if (action === "dec") {
      item.quantity -= 1;
    }

    // 🔥 If quantity becomes 0 remove item
    cart.items = cart.items.filter((item) => item.quantity > 0);

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
   .populate("items.dish");

    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.dish");

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        items: [],
        pricing: {
          subtotal: 0,
          gst: 0,
          deliveryCharge: 0,
          grandTotal: 0
        }
      });
    }

    let subtotal = 0;

    const updatedItems = cart.items.map(item => {
      const itemSubtotal = item.quantity * item.dish.price;
      subtotal += itemSubtotal;

      return {
        dish: item.dish,
        quantity: item.quantity,
        price: item.dish.price,
        subtotal: itemSubtotal
      };
    });

    // Pricing logic
    const gstRate = 0.05; // 5% GST
    const deliveryCharge = subtotal > 200 ? 0 : 40; // Free delivery above 500
    const gst = Number((subtotal * gstRate).toFixed(2));
    const grandTotal = subtotal + gst + deliveryCharge;

    res.status(200).json({
      items: updatedItems,
      pricing: {
        subtotal,
        gst,
        deliveryCharge,
        grandTotal
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({
      message: "Cart cleared"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addToCart,
  updateCartItem,
  getUserCart,
  clearCart
};