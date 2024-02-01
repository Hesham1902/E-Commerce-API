const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uuid } = require("uuidv4");

const { uploadMultiImages } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const productModel = require("../models/productModel");

exports.uploadProductImage = uploadMultiImages([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

exports.resizeProductImage = asyncHandler(async (req, res, next) => {
  //1- Image processing for imageCover

  if (req.files) {
    if (req.files.imageCover) {
      const imageCoverFileName = `product-${uuid()}-${Date.now()}-cover.jpeg`;
      await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 95 })
        .toFile(`uploads/products/${imageCoverFileName}`);

      //save image into database
      req.body.imageCover = imageCoverFileName;
    }
  }
  //2- Image processing for images
  if (req.files) {
    if (req.files.images) {
      req.body.images = [];
      await Promise.all(
        req.files.images.map(async (img, index) => {
          const imageName = `product-${uuid()}-${Date.now()}-${index + 1}.jpeg`;
          await sharp(img.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 95 })
            .toFile(`uploads/products/${imageName}`);
          //save image into database
          req.body.images.push(imageName);
        })
      );
    }
  }
  next();
});

exports.getProducts = factory.getAll(productModel, "Products");

exports.getProduct = factory.getOne(productModel, {
  path: "reviews",
  select: "title user -product -_id",
});

exports.createProduct = factory.createOne(productModel);

exports.updateProduct = factory.updateOne(productModel);

exports.deleteProduct = factory.deleteOne(productModel);
