const ApiError = require("../utils/apiError");

/* eslint-disable arrow-body-style */
const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    err,
    message: err.message,
    stack: err.stack,
  });
const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const JsonWebTokenErrorHandler = () =>
  // eslint-disable-next-line no-new
  new ApiError("Invalid token, please login again..", 401);
const TokenExpiredErrorHandler = () =>
  // eslint-disable-next-line no-new
  new ApiError("Token Expired, please login again..", 401);

const globalError = (err, req, res, next) => {
  console.log("iam in express error handler");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    if (err.name === "JsonWebTokenError") err = JsonWebTokenErrorHandler();
    sendErrorForDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "JsonWebTokenError") err = JsonWebTokenErrorHandler();
    if (err.name === "TokenExpiredError") err = TokenExpiredErrorHandler();
    sendErrorForProd(err, res);
  }
};

module.exports = globalError;
