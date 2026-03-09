const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticateUser = async (req, res, next) => {
  try {
    const { token }= req.cookies;
    if(!token){
      return res.status(401).send("Please Login!!")
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // 🔥 VERY IMPORTANT

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticateUser };