const { check } = require("express-validator");
const slugify = require("slugify");

const userModel = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required !")
    .isLength({ min: 3 })
    .withMessage("Too short user name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),

  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      await userModel.findOne({ email: val }).then((user) => {
        if (user) {
          throw new Error("email already exist !");
        }
        return true;
      });
    }),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("Too short password")
    .custom((password, { req }) => {
      if (password !== req.body.confirmPassword) {
        throw new Error("Password confirmation incorrect");
      }
      return true;
    }),

  check("confirmPassword").notEmpty().withMessage("confirm password required"),

  validatorMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email required")
    .isEmail()
    .withMessage("invalid email address"),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .isLength({ min: 6 })
    .withMessage("Too short password"),

  validatorMiddleware,
];
