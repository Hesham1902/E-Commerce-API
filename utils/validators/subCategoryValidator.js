const { check, body } = require("express-validator");
const slugify = require("slugify");
const categoryModel = require("../../models/categoryModel");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid SubCategory id Format"),
  validatorMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory Required !")
    .isLength({ min: 2 })
    .withMessage("Too short SubCategory name")
    .isLength({ max: 32 })
    .withMessage("Too Long SubCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Subcategory must belong to parent category")
    .isMongoId()
    .withMessage("invalid Category id format")
    .custom((categoryId) =>
      categoryModel.findById(categoryId).then((category) => {
        if (category) {
          return true;
        }
        return Promise.reject(
          new Error(`No category for this id: ${categoryId}`)
        );
      })
    ),
  validatorMiddleware,
];

exports.updatedSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id Format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id Format"),
  validatorMiddleware,
];
