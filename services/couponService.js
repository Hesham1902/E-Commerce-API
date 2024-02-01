const factory = require("./handlersFactory");
const couponModel = require("../models/couponModel");

// @desc    Get list of coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin-Manager
exports.getCoupons = factory.getAll(couponModel);

// @desc    Get specific coupon
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin-Manager
exports.getCoupon = factory.getOne(couponModel);

// @desc    Create coupons
// @route   POST /api/v1/coupons
// @access  Private/Admin-Manager
exports.createCoupon = factory.createOne(couponModel);

// @desc    Update specific coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin-Manager
exports.updateCoupon = factory.updateOne(couponModel);

// @desc    Delete specific coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin-Manager
exports.deleteCoupon = factory.deleteOne(couponModel);
