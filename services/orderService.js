const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");

const cartModel = require("../models/cartModel");
const userModel = require("../models/userModel");
const productModel = require("../models/productModel");
const orderModel = require("../models/orderModel");

// @desc     Create cash order
// @route    POST api/v1/orders/cartId
// @access   Protected
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  // App setting
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`Cart not found with id ${req.params.cartId}`, 404)
    );
  }

  let totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  totalOrderPrice += taxPrice + shippingPrice;

  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  if (order) {
    // 1) better time complexity

    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.Quantity, sold: +item.Quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});

    // 2) bad time complexity

    //   cart.cartItems.forEach(async (item) => {
    //     const product = await productModel.findById(item.product);
    //     product.quantity -= item.Quantity;
    //     product.sold += item.Quantity;
    //     await product.save();
    //   });
  }

  //4) clear the cart
  await cartModel.findByIdAndDelete(req.params.cartId);

  res.status(201).json({ status: "success", data: order });
});

exports.createFilterObj = (req, res, next) => {
  let filterObj = {};
  if (req.user.role === "user") {
    filterObj = { user: req.user._id };
  }
  req.filterObj = filterObj;
  next();
};

// @desc     Get All cash orders
// @route    GET api/v1/orders
// @access   Protected/Admin-Manager-User
exports.findAllOrders = factory.getAll(orderModel);

// @desc     Get specific order
// @route    GET api/v1/orders
// @access   Protected/Admin-Manager-User
exports.findSpecificOrder = factory.getOne(orderModel);

// @desc     Update order deliver status
// @route    GET api/v1/orders/:orderId/delivered
// @access   Protected/Admin-Manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.orderId,
    {
      isDelivered: true,
      deliveredAt: Date.now(),
    },
    { new: true }
  );
  if (!order) {
    return next(
      new ApiError(`There is no order with this id ${req.params.orderId}`, 404)
    );
  }
  res.status(201).json({ status: "success", data: order });
});

// @desc     Update order paid status
// @route    GET api/v1/orders/:orderId/pay
// @access   Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.orderId,
    {
      isPaid: true,
      paidAt: Date.now(),
    },
    { new: true }
  );
  if (!order) {
    return next(
      new ApiError(`There is no order with this id ${req.params.orderId}`, 404)
    );
  }
  res.status(201).json({ status: "success", data: order });
});

// @desc     Get checkout session from stripe and send it as response
// @route    GET api/v1/orders/checkout-session/cartId
// @access   Protected/User

exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // App setting
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`Cart not found with id ${req.params.cartId}`, 404)
    );
  }
  // const cartPrice = cart.totalPriceAfterDiscount
  //   ? cart.totalPriceAfterDiscount
  //   : cart.totalCartPrice;

  const lineItems = cart.cartItems.map(async (item) => {
    const totalOrderPrice = item.price + taxPrice + shippingPrice;
    const product = await productModel.findById(item.product);
    return {
      price_data: {
        unit_amount: totalOrderPrice * 100, // Assuming price is in the smallest currency unit (e.g., cents)
        currency: "egp",
        product_data: {
          name: product.title,
          description: item.color,
        },
      },
      quantity: item.Quantity,
    };
  });
  const resolvedLineItems = await Promise.all(lineItems);
  console.log(resolvedLineItems);

  // create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: resolvedLineItems,
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  res.status(200).json({ status: "success", session });
});

const createOrder = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;
  console.log(orderPrice);

  const cart = await cartModel.findById(cartId);
  const User = await userModel.findOne({ email: session.customer_email });

  //Create order
  const order = await orderModel.create({
    user: User._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethod: "card",
  });
  if (order) {
    // 1) better time complexity

    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.Quantity, sold: +item.Quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    // Clear the cart
    await cartModel.findByIdAndDelete(cartId);
  }
};

// @desc    This webhook will run when stripe payment success paid
// @route   POST /webhook-checkout
// @access  Protected/User
exports.webhookCheckout = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    createOrder(event.data.object);
  }
  res.status(200).json({ recieved: "true" });
});
