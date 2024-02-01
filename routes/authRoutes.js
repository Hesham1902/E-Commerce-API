const express = require("express");

const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyResetPassword,
  resetPassword,
} = require("../services/authService");

const {
  signupValidator,
  loginValidator,
} = require("../utils/validators/authValidator");

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

// Reset Password
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyResetPassword);
router.put("/resetPassword", resetPassword);
module.exports = router;
