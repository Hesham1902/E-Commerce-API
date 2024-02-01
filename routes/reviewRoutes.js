const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdToBody,
} = require("../services/reviewService");

const authService = require("../services/authService");

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authService.protect,
    authService.allowedTo("user"),
    setProductIdToBody,
    createReviewValidator,
    createReview
  );

router.use(authService.protect);

router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(authService.allowedTo("user"), updateReviewValidator, updateReview)
  .delete(
    authService.allowedTo("user", "manager", "admin"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
