const Restaurant = require("../models/Restaurants");

// 🔹 Get All Restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({
      $and : [
        {isApproved :true},
        {isBlocked : false}
      ]
    }).populate("owner", "name email");

    res.json(restaurants);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants", error });
  }
};

// 🔹 Get All Restaurants
const getOneRestaurants = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurants = await Restaurant.findOne({
       _id : id
    }).populate("owner", "name email");

    res.json(restaurants);

  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurants", error });
  }
};

module.exports = { getAllRestaurants,getOneRestaurants };