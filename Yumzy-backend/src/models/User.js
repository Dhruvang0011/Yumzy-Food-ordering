const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 never return password in queries
    },

    phone: String,
    address: String,

    role: {
      type: String,
      enum: ["user", "admin", "restaurantOwner"],
      default: "user",
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);