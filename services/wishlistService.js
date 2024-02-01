const asyncHandler = require("express-async-handler");

const userModel = require("../models/userModel");

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Protected/User
exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added successfully to wishlist",
    data: user.wishList,
  });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:id
// @access  Protected/User
exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  console.log(req.params.productId);
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishList: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed successfully to wishlist",
    data: user.wishList,
  });
});

// @desc    Get logged user wishlist
// @route   GET /api/v1/wishlist
// @access  Protected/User
exports.getUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate("wishList");

  res.status(200).json({
    status: "success",
    results: user.wishList.length,
    data: user.wishList,
  });
});
