const express = require("express")
const User = require("../models/User");
const Restaurant = require("../models/Restaurants")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔹 Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      role: "user"
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone:user.phone,
        address : user.address,
        role: user.role
        }
    });

  } catch (error) {
  res.status(500).json({
    message: "Registration failed",
    error: error.message
  });
  }
};

// 🔹 Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone:user.phone,
        address : user.address,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed",
      error: error.message
     });
  }
};

// Update Logged-in User Profile
const updateUser = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    const { name, phone, address } = req.body;

    // Only allow these fields
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        phone,
        address,
      },
      { returnDocument: "after", runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.user._id; // coming from auth middleware

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });

  } catch (error) {
    console.error("GetUser Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

const getownerProfile = async(req,res) => {
    try {
    const ownerId = req.user._id;

    const user = await User.findById(ownerId).select("name email phone");

    const restaurant = await Restaurant.findOne({ owner: ownerId });

    res.json({
      user,
      restaurant,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
}

const updateownerProfile = async(req,res) => {
  try {
    const ownerId = req.user._id;
    const { name, phone } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      ownerId,
      { name, phone },
      { new: true }
    ).select("name email phone");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
}

module.exports = { registerUser, loginUser,updateUser,logoutUser,getUser,getownerProfile,updateownerProfile };