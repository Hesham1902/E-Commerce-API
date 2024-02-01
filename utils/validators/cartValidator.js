const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const cartModel = require("../../models/cartModel");
const productModel = require("../../models/productModel");

exports.addProductToCartValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product id Format")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new Error("This product is no more exist");
      }
    }),
  validatorMiddleware,
];

exports.DeleteProductFromCartValidator = [
  check("cartItemId")
    .isMongoId()
    .withMessage("Invalid cart item id Format")
    .custom(async (val, { req }) => {
      const cart = await cartModel.findOne({ user: req.user._id });
      if (!cart) {
        throw new Error("No cart exist !");
      }
      const result = cart.cartItems.find((item) => item._id.toString() === val);
      console.log(result);
      if (!result) {
        throw new Error(`No cart item with this id: ${val}`);
      }
    }),
  validatorMiddleware,
];
