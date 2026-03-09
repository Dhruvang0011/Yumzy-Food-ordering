const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant"
  },

  sectionName: {
    type : String
  },
  name:{
    type: String
  },
  price: {
    type : Number
  } ,
  type: {
    type: String,
    enum: ["veg", "non-veg"]
  },
  img: {
    type : String
  }

}, { timestamps: true });

module.exports = mongoose.model("Dish", dishSchema);