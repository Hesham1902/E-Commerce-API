const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");

const reviewModel = require("../models/reviewModel");


exports.setProductIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  next();
};

//Nested route for (Get)
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
  }
  req.filterObj = filterObject;
  next();
};
// @desc    Get list of reviews
// @route   Get /api/v1/reviews
// @access  Public
exports.getReviews = factory.getAll(reviewModel);

// @desc    Get specific review by id
// @route   Get /api/v1/reviews/:id
// @access  Public
exports.getReview = factory.getOne(reviewModel);

// @desc    Create a review
// @route   POST /api/v1/reviews
// @access  Private/Protect/User
exports.createReview = asyncHandler(async (req, res, next) => {
  const doc = await reviewModel.create({
    title: req.body.title,
    ratings: req.body.ratings,
    user: req.user._id,
    product: req.body.product,
  });
  res.status(201).json({ data: doc });
});

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private/Protect/User
exports.updateReview = factory.updateOne(reviewModel);

// @desc    Delete specific review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Protect/User-Admin-Manager
exports.deleteReview = factory.deleteOne(reviewModel);


