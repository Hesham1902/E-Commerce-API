const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const cartModel = require("../../models/cartModel");
const orderModel = require("../../models/orderModel");
const productModel = require("../../models/productModel");

exports.createCashOrderValidator = [
  check("cartId").custom(async (val, { req }) => {
    const cart = await cartModel.findById(val);
    if (!cart) throw new Error(`No cart with this id: ${val}`);
    // Use Promise.all to wait for all promises to complete

    await Promise.all(
      // Use map to create an array of promises
      cart.cartItems.map(async (item) => {
        const product = await productModel.findById(item.product);
        console.log(item.Quantity);
        console.log(product.quantity);
        if (item.Quantity > product.quantity) {
          throw new Error("Quantity exceeds available stock");
        }
      })
    );

    return true;
  }),
  validatorMiddleware,
];

exports.getOneOrderValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid order id format")
    .custom(async (val, { req }) => {
      const orders = await orderModel.find({ user: req.user._id });
      const test = orders.some((order) => order._id.toString() === val);
      if (!test) {
        throw new Error(`Not valid order id: ${val}`);
      }
    }),
  validatorMiddleware,
];
