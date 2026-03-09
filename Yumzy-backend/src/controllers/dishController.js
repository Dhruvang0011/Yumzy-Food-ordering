const Restaurant = require("../models/Restaurants");
const Dish = require("../models/Dishes")

const addDish = async (req, res) => {
  try {
    const { restaurant, sectionName, name, price,type,img } = req.body;

    // Check if restaurant belongs to logged in user
    const validrestaurant = await Restaurant.findOne({
      _id: restaurant,
      owner: req.user.id
    });

    if (!validrestaurant) {
      return res.status(403).json({
        message: "You are not allowed to add dish to this restaurant!!"
      });
    }

    const dishAlready = await Dish.findOne({
      name: name,
      restaurant: restaurant
    });

    if (dishAlready) {
      return res.status(400).json({
      message: "Dish already exists in this restaurant."
      });
    }

    const dish = await Dish.create({
      ...req.body 
    });

    res.status(201).json({
      message: "Dish added successfully",
      dish
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add dish",
      error: error.message
    });
  }
};

// 🔹 Update Dish (Restaurant Owner Only)
const updateDish = async (req, res) => {
  try {
    const { id } = req.body;

    const dish = await Dish.findById(id).populate("restaurant");

    if (!dish) {
      return res.status(404).json({
        message: "Dish not found"
      });
    }

    // Check ownership
    if (dish.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this dish"
      });
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Dish updated successfully",
      dish: updatedDish
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update dish",
      error: error.message
    });
  }
};

// 🔹 Update Dish (Restaurant Owner Only)
const deleteDish = async (req,res) => {
  try{
    const {id} = req.body;
    const dish = await Dish.findById(id).populate("restaurant");

    if (!dish) {
      return res.status(404).json({
        message: "Dish not found"
      });
    }

    if (dish.restaurant.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to update this dish"
      });
    }

    const deleteDish = await Dish.findByIdAndDelete(id);

    res.status(200).json({
      message: "Dish Deleted successfully"
    });

  }catch(error){
    res.status(500).json({
      message: "Failed to Delete Dish.",
      error: error.message
    });
  }
}

// 🔹 Get Dishes By Restaurant
const getRestaurantDishes = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const dishes = await Dish.find({ restaurant: restaurantId });

    res.status(200).json(dishes);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dishes",
      error: error.message
    });
  }
};

module.exports = { addDish, getRestaurantDishes,updateDish,deleteDish };