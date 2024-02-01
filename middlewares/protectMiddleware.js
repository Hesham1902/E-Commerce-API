const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/apiError");
const userModel = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    // return next(new ApiError("You must login to get access to this route", 401));

    // This works because the asyncHandler so, no need to pass it to next()
    throw new ApiError("You must login to get access to this route", 401);
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const currentUser = await userModel.findById(decoded.userId);
  if (!currentUser) {
    throw new ApiError("Invalid Token, this is not your token", 401);
  }
  // Check if the user is deactivated
  if (!currentUser.active && req.originalUrl !== "/api/v1/users/activateMe") {
    return next(new ApiError("Your account has been deactivated"));
  }
  // Check if the password changed after generating the token
  if (currentUser.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      currentUser.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimeStamp > decoded.iat) {
      throw new ApiError(
        "User Recently changed his password, please login again...",
        401
      );
    }
  }
  // console.log(req.lastToken);
  // check if this token is the last token generated for this user

  // if (currentUser.lastToken !== token) {
  //   throw new ApiError(
  //     "Invalid token not the last token, please login again...",
  //     401
  //   );
  // }
  req.user = currentUser;
  next();
});

module.exports = protect;
