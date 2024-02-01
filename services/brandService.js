const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { uuid } = require("uuidv4");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const brandModel = require("../models/brandModel");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuid()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/brands/${filename}`);

    //save image into database
    req.body.image = filename;
  }

  next();
});

exports.uploadBrandImage = uploadSingleImage("image");

exports.getBrands = factory.getAll(brandModel);

exports.getBrand = factory.getOne(brandModel);

exports.createBrand = factory.createOne(brandModel);

exports.updateBrand = factory.updateOne(brandModel);

exports.deleteBrand = factory.deleteOne(brandModel);
