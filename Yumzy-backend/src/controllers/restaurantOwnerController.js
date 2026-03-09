const User = require("../models/User");
const Restaurant = require("../models/Restaurants");
const Order = require("../models/Order")


const getRestaurant = async(req,res) => {
    try {
    const restaurant = await Restaurant.findOne({
      owner : req.user._id,
    });

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
}

// 🔹 Create Restaurant (Restaurant Owner Only)
const createRestaurant = async (req, res) => {
  try {
    const userHasRestaurent = await Restaurant.findOne({
    owner: req.user.id
    });

    if (userHasRestaurent) {
      return res.status(400).json({
      message: "You already have one restaurant."
      });
    }

    const restaurant = await Restaurant.create({
      ...req.body,
      owner: req.user.id
    });

    res.status(201).json({
      message: "Restaurant created",
      restaurant
    });

  } catch (error) {
    res.status(500).json({ message: "Failed to create restaurant", error });
  }
};

const restaurantStats = async(req,res) => {
   try {
    const ownerId = req.user._id;

    const orders = await Order.find()
      .populate({
        path: "restaurant",
        select: "owner",
      });

    // Orders belonging to this owner
    const ownerOrders = orders.filter(
      (o) => o.restaurant?.owner?.toString() === ownerId.toString()
    );

    const totalOrders = ownerOrders.length;

    // Today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = ownerOrders.filter(
      (o) => new Date(o.createdAt) >= today
    );

    const todayOrdersCount = todaysOrders.length;

    const revenueToday = todaysOrders.reduce(
      (sum, order) => sum + order.pricing.totalAmount,
      0
    );

    // ---------------------------
    // 7 DAY CHART LOGIC
    // ---------------------------

    const last7Days = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      const count = ownerOrders.filter((order) => {
        const created = new Date(order.createdAt);
        return created >= start && created <= end;
      }).length;

      last7Days.push({
        day: days[date.getDay()],
        orders: count,
      });
    }

    res.json({
      todayOrders: todayOrdersCount,
      totalOrders,
      revenueToday,
      last7Days,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
}

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.body;

    // Find restaurant
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found"
      });
    }

    // Check if logged in user is owner
    if (restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this restaurant"
      });
    }

    // Update restaurant
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      id,
      {
        ...req.body,
        isApproved: false // Re-approval required after update
      },
      { new: true }
    );

    res.status(200).json({
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update restaurant",
      error: error.message
    });
  }
};


module.exports = {getRestaurant,createRestaurant,restaurantStats,updateRestaurant};