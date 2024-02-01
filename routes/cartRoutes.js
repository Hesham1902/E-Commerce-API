const express = require("express");

const router = express.Router();
const {
  addProdToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  clearCart,
  updateProdQuantity,
  applyCoupon,
} = require("../services/cartService");

const {
  addProductToCartValidator,
  DeleteProductFromCartValidator,
} = require("../utils/validators/cartValidator");

const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .get(getLoggedUserCart)
  .post(addProductToCartValidator, addProdToCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:cartItemId")
  .get()
  .put(updateProdQuantity)
  .delete(DeleteProductFromCartValidator, removeSpecificCartItem);

module.exports = router;
