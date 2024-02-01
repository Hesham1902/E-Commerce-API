const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const userModel = require("../../models/userModel");

exports.addAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Alias required")
    .custom(async (val, { req }) => {
      const user = await userModel.findOne({
        _id: req.user._id,
        "addresses.alias": val,
      });
      if (user) {
        console.log(user);
        throw new Error("Duplicate address's alias");
      }
      return true;
    }),
  //   check("postalCode").isPostalCode().withMessage("Invalid Postal Code"),
  validatorMiddleware,
];

exports.updateAddressValidator = [
  check("alias")
    .optional()
    .custom(async (val, { req }) => {
      const user = await userModel.findOne({
        _id: req.user._id,
        "addresses.alias": val,
      });

      if (user) {
        throw new Error("Duplicate address's alias");
      }
      return true;
    }),
  //   check("postalCode").isPostalCode().withMessage("Invalid Postal Code"),
  validatorMiddleware,
];
