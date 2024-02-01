const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

const productModel = require("../../models/productModel");

//  افتكر نراجع فكرة ليه ال بروميس مبيطلعش فاليديشن ايرور
exports.addToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product id Format")
    .custom(async (val, { req }) => {
      const product = await productModel.findById(val);
      if (!product) {
        throw new Error(`No product found with this id ${val}`);
      }
      // productModel.findById(val).then((product) => {
      //   if (!product) {
      //     return Promise.reject(
      //       new Error(`No product found with this id ${val}`)
      //     );
      //   }
      //   return true;
      // });
    }),
  validatorMiddleware,
];
