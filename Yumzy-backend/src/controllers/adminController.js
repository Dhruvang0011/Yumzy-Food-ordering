// controllers/adminController.js
const User = require("../models/User");
const Restaurant = require("../models/Restaurants");
const Order = require("../models/Order")
const bcrypt = require("bcrypt")

const createOwner = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const owner = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "restaurantOwner",
    });

    res.status(201).json({
      message: "Owner created successfully",
      owner,
    });
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: "Server error" });
  }
};

const getOwners = async(req,res) => {
   try {
    const owners = await User.find({ role: "restaurantOwner" })
      .select("-password")
      .populate("restaurant");

    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

const deleteOwner = async(req,res) => {
   try {
    await User.findByIdAndDelete(req.body.id);

    res.json({
      message: "Owner deleted successfully",
    });
  } catch(error) {
    console.log(error.message)
    res.status(500).json({ message: "Delete failed" });
  }
}

const stats = async (req,res) => {
 try {
      const totalRestaurants = await Restaurant.countDocuments();
      const pendingRestaurants = await Restaurant.countDocuments({
        status: "pending",
      });
      const totalUsers = await User.countDocuments({ role: "user" });
      const totalOrders = await Order.countDocuments();

      // 🔥 Orders grouped by date (last 7 days)
      const last7Days = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      res.status(200).json({
        totalRestaurants,
        pendingRestaurants,
        totalUsers,
        totalOrders,
        last7Days,
      });
    } catch (error) {
      console.error("Admin stats error:", error);
      res.status(500).json({ message: "Server error" });
    } 
}

const getresto = async(req,res) => {
try {
      const restaurants = await Restaurant.find()
        .populate("owner", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
}

// 🔹 Approve Restaurent Only Admin
const approveRestaurants = async (req, res) => {
  try {
    const { id } = req.body;

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true } // return updated document
    );

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.status(200).json({
      message: "Restaurant approved successfully",
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong!!",
      error: error.message
    });
  }
};

const deleteRestro = async(req,res) => {
  try {
      await Restaurant.findByIdAndDelete(req.body.id);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
}

const blockrestro = async (req, res) => {
  try {
    const { id } = req.body; // restaurant id

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    restaurant.isBlocked = true;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant blocked successfully",
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

const unblockRestro = async (req, res) => {
  try {
    const { id } = req.body;

    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found"
      });
    }

    if (!restaurant.isBlocked) {
      return res.status(400).json({
        success: false,
        message: "Restaurant is already unblocked"
      });
    }

    restaurant.isBlocked = false;
    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant unblocked successfully",
      restaurant
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};

const getoders = async(req,res) => {
    try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("restaurant", "resName")
      .sort({ createdAt: -1 }) // newest orders first
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalOrders / limit),
      totalOrders,
      orders
    });

  } catch (error) {
    console.error("Admin Orders Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
}

const getUsers = async(req,res) => {
   try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}
module.exports = {createOwner,getOwners,deleteOwner,stats,getresto,approveRestaurants,deleteRestro,blockrestro,unblockRestro,getoders,getUsers}