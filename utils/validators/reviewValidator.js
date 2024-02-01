const { check, body } = require("express-validator");

const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const reviewModel = require("../../models/reviewModel");

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid review id Format"),
  validatorMiddleware,
];

exports.createReviewValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Too short review name")
    .isLength({ max: 64 })
    .withMessage("Too long review name"),
  check("ratings")
    .notEmpty()
    .withMessage("Rating required !")
    .isNumeric()
    .withMessage("Rating price must be a number")
    .isFloat({ min: 1, max: 5 }, "Rating must between 1 and 5"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id Format")
    .custom(async (val, { req }) => {
      const test = await reviewModel.findOne({
        user: req.user._id,
        product: val,
      });
      if (test) {
        throw new Error("You can't have more than one review for this product");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id Format")
    .custom(async (val, { req }) => {
      const review = await reviewModel.findOne({
        _id: val,
        user: req.user._id,
      });
      if (!review) {
        throw new Error("Not allowed to update this review");
      }
      return true;
    }),
  body("title").optional(),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid review id Format")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await reviewModel.findOne({
          _id: val,
          user: req.user._id,
        });
        if (!review) {
          throw new Error("Not allowed to update this review");
        }
        return true;
      }
    }),
  validatorMiddleware,
];
