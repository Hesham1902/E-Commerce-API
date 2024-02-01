const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");
const protectMiddleware = require("../middlewares/protectMiddleware");
const sendMail = require("../utils/sendEmail");
const createHash = require("../utils/createHash");

// @desc    Signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = createToken(user._id);
  user.lastToken = token;
  res.status(201).json({ data: user, token });
});

// @desc    Login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Incorrect email or password", 401));
  }
  const token = createToken(user._id);
  // user.lastToken = token;
  // await user.save();
  delete user._doc.password;
  res.status(200).json({ data: user, token });
});

// @desc   make sure the user is logged in
exports.protect = protectMiddleware;

// @desc authorization limit access to roles
exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc Forgot Password
// @route POST /api/v1/auth/forgotPassword
// @access Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = createHash(resetCode);
  user.passwordResetCode = hashedCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerified = false;

  await user.save();

  const message = ` <h2>Hello <strong>${user.name}</strong>,</h2>
  <p>We received a request to reset the password for the account associated with <strong>${user.email}</strong>.</p>
  <p><strong>${resetCode}</strong> Enter this code to reset the password.</p> \n \n
  The E-shop Team
`;

  try {
    await sendMail({
      email: user.email,
      subject: `your reset password code (valid for 10 min)`,
      message,
    });
  } catch (err) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();

    return next(new ApiError("There is an error with sending email", 500));
  }

  res
    .status(200)
    .json({ status: "success", message: "reset code was successfully sent" });
});

// @desc Verify reset password code
// @route POST /api/v1/auth/verifyResetCode
// @access Public
exports.verifyResetPassword = asyncHandler(async (req, res, next) => {
  const hash = createHash(req.body.resetCode);
  const user = await userModel.findOne({
    passwordResetCode: hash,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ApiError("Invalid reset code or expired", 404));
  }
  user.passwordResetVerified = true;
  await user.save();

  res.status(200).json({ status: "success" });
});

// @desc Reset password
// @route POST /api/v1/auth/resetPassword
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ApiError(`There is no user with that email ${req.body.email}`, 404)
    );
  }
  if (!user.passwordResetVerified) {
    return next(new ApiError("Reset code not verified", 400));
  }
  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  await user.save();

  const token = createToken(user._id);

  res.status(200).json({ token, message: "Password Updated !" });
});
