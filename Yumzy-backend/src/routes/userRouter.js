const express = require("express");
const router = express.Router();
const {authenticateUser} = require("../middleware/auth")
const {
  registerUser,
  getUser,
  updateUser,
  loginUser,
  logoutUser
} = require("../controllers/userController");

router.post("/register", registerUser);

router.get("/profile",
  authenticateUser,
  getUser)

router.put("/update",
  authenticateUser,
  updateUser
)

router.post("/login", loginUser);
router.post("/logout", logoutUser);


module.exports = router;