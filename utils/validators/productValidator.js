const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const categoryModel = require("../../models/categoryModel");
const subCategoryModel = require("../../models/subCategoryModel");

exports.createProductValidator = [
  check("title")
    .notEmpty()
    .withMessage("Product Required !")
    .isLength({ min: 3 })
    .withMessage("Too short product name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required !")
    .isLength({ max: 2000 })
    .withMessage("Too long product description"),
  check("quantity").notEmpty().withMessage("Product quantity is required"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("Too long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product PriceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Available colors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid Id format")
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
  check("subcategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid Id format")
    .custom((subcategoriesIds, { req }) => {
      const hasDuplicates = subcategoriesIds.some((element, index, array) => {
        return array.indexOf(element) !== index;
      });
      if (hasDuplicates) {
        return Promise.reject(new Error("Subcategories are repeadted !"));
      }
      return subCategoryModel
        .find({ _id: { $in: subcategoriesIds }, category: req.body.category })
        .then((result) => {
          if (result.length < 1 || result.length !== subcategoriesIds.length) {
            return Promise.reject(new Error("invalid subcategories"));
          }
        });
    }),
  check("brand").optional().isMongoId().withMessage("Invalid Id format"),
  check("ratingAverage")
    .isNumeric()
    .optional()
    .withMessage("ratingAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingQuantites")
    .optional()
    .isNumeric()
    .withMessage("ratingQuantites must be a number"),
  validatorMiddleware,
];

exports.getProductValidator = [
  check("id").isMongoId().withMessage("invalid product id Format"),
  validatorMiddleware,
];
exports.updateProductValidator = [
  check("id").isMongoId().withMessage("invalid product id Format"),
  body("title")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("imageCover").optional(),
  validatorMiddleware,
];

exports.deleteProductValidator = [
  check("id").isMongoId().withMessage("invalid product id Format"),
  validatorMiddleware,
];
