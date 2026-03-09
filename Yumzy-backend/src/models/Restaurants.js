const mongoose = require("mongoose")

const RestaurantSchema = new mongoose.Schema({
  resName: String,
  cuisines: String,
  rating: String,
  time: String,
  img: String,
  costForTwo: String,
  promoted: Boolean,

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  isApproved : {
    type : Boolean,
    default : false,
  },
  isBlocked : {
    type:Boolean,
    default : false
  }

}, { timestamps: true });

module.exports = mongoose.model("Restaurant", RestaurantSchema);