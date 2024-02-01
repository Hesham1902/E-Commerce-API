const express = require("express");

const router = express.Router();
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} = require("../services/couponService");

const authService = require("../services/authService");

router.use(authService.protect, authService.allowedTo("admin", "manager"));

router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
