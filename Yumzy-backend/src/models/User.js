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
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    providers: [
      {
        provider: {
          type: String,
          enum: ["local", "google", "github", "facebook"],
          required: true,
        },
        providerId: {
          type: String,
          required: true,
        },
      },
    ],

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
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);