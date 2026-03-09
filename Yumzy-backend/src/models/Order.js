const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    items: [
      {
        dish: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
        },
        name: String,          // snapshot
        quantity: Number,
        price: Number,         // snapshot price
        subtotal: Number       // price * quantity
      },
    ],

    pricing: {
      subtotal: Number,
      gst: Number,
      deliveryCharge: Number,
      totalAmount: Number,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
      ],
      default: "pending",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paymentId: String, // for Razorpay later

    address: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);