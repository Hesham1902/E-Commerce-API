const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const productModel = require("../models/productModel");
const couponModel = require("../models/couponModel");
const cartModel = require("../models/cartModel");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.Quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc    Add Product to Cart
// @route   POST /api/v1/carts
// @access  Private/User
exports.addProdToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await productModel.findById(productId);
  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // product exist in cart, update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      cart.cartItems[productIndex].Quantity += 1;
    }
    // product not exist in cart, push product to cartItems array
    else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }
  //calculate total cart price
  calcTotalPrice(cart);
  await cart.save();

  res.status(200).json({
    message: "Product added to cart!",
    numOfCartItems: cart.cartItems.length,
    cart,
  });
});

// @desc    Get logged user Cart
// @route   GET /api/v1/carts
// @access  Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`No cart found with this user id: ${req.user._id}`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Delete item from cart items
// @route   DELETE /api/v1/carts/:cartItemId
// @access  Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.cartItemId } } },
    { new: true }
  );
  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "Deleted",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Clear cart items
// @route   DELETE /api/v1/carts/
// @access  Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/carts/
// @access  Private/User
exports.updateProdQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user: ${req.user._id} `)
    );
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.cartItemId
  );
  if (itemIndex > -1) {
    cart.cartItems[itemIndex].Quantity = quantity;
  } else {
    return next(
      new ApiError(`There is no item for this id ${req.params.cartItemId}`, 404)
    );
  }
  calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

// @desc    Apply coupon on logged user cart
// @route   PUT /api/v1/cart/applyCoupon
// @access  Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError(`This Coupon is invalid or expired`, 404));
  }
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(
      new ApiError(`No cart found for this user: ${req.user._id}`, 404)
    );
  }

  const totalPrice = cart.totalCartPrice;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;

  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
