const { check, body } = require("express-validator");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const userModel = require("../../models/userModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.createUserValidator = [
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

  check("profileImg").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only EG and SA phones accepted"),

  check("role").optional(),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("invalid user id Format"),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("invalid user id Format"),
  body("name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .optional(),

  check("email")
    .notEmpty()
    .optional()
    .withMessage("Email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      await userModel.findOne({ email: val }).then((user) => {
        if (user) {
          throw new Error("E-mail already exist !");
        }
        return true;
      });
    }),
  check("profileImg").optional(),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only EG and SA phones accepted"),

  check("role").optional(),
  validatorMiddleware,
];
exports.updateLoggedUserValidator = [
  body("name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .optional(),

  check("email")
    .notEmpty()
    .optional()
    .withMessage("Email required")
    .isEmail()
    .withMessage("invalid email address")
    .custom(async (val) => {
      await userModel.findOne({ email: val }).then((user) => {
        if (user) {
          throw new Error("E-mail already exist !");
        }
        return true;
      });
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Only EG and SA phones accepted"),

  validatorMiddleware,
];
exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("invalid user id Format"),

  check("currentPassword")
    .notEmpty()
    .withMessage("Current password required")
    .custom(async (oldPassword, { req }) => {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new Error("Incorrect current password");
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .custom((password, { req }) => {
      if (password !== req.body.confirmNewPassword) {
        throw new Error("incorrect confirm new password");
      }
      return true;
    }),
  check("confirmNewPassword")
    .notEmpty()
    .withMessage("confirm new password required"),
  validatorMiddleware,
];

exports.changeMyPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password required")
    .custom(async (oldPassword, { req }) => {
      const user = await userModel.findById(req.user._id);
      if (!user) {
        throw new Error("There is no user for this id");
      }
      if (!(await bcrypt.compare(oldPassword, user.password))) {
        throw new Error("Incorrect current password");
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("password required")
    .custom((password, { req }) => {
      if (password !== req.body.confirmNewPassword) {
        throw new Error("incorrect confirm new password");
      }
      return true;
    }),
  check("confirmNewPassword")
    .notEmpty()
    .withMessage("confirm new password required"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid user id Format"),
  validatorMiddleware,
];
