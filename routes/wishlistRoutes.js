const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getUserWishlist,
} = require("../services/wishlistService");
const {
  addToWishlistValidator,
} = require("../utils/validators/wishlistValidator");

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .get(getUserWishlist)
  .post(addToWishlistValidator, addProductToWishlist);

router.delete("/:productId", removeProductFromWishlist);

module.exports = router;
