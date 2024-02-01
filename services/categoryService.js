const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { uuid } = require("uuidv4");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const categoryModel = require("../models/categoryModel");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `category-${uuid()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`);

    //save image into database
    req.body.image = filename;
  }

  next();
});

exports.uploadCategoryImage = uploadSingleImage("image");

exports.getCategories = factory.getAll(categoryModel);

exports.createCategories = factory.createOne(categoryModel);

exports.getCategory = factory.getOne(categoryModel);

exports.updateCategory = factory.updateOne(categoryModel);

// exports.updateCategory = asyncHandler(async (req, res, next) => {
//   const { categoryId } = req.params;
//   const categoryName = req.body.name;

//   // const category = await categoryModel.findById(categoryId);
//   // if (categoryName) {
//   //   category.name = categoryName;
//   //   category.slug = slugify(categoryName);
//   // }
//   // const result = await category.save();
//   const category = await categoryModel.findOneAndUpdate(
//     { _id: categoryId },
//     { name: categoryName, slug: slugify(categoryName) },
//     { new: true }
//   );
//   if (!category) {
//     // return res
//     //   .status(404)
//     //   .json({ message: `No Category Found for this id ${categoryId}` });
//     return next(
//       new ApiError(`No Category Found for this id ${categoryId}`, 404)
//     );
//   }
//   res.status(201).json({ message: "Category Updated !!", data: category });
// });

exports.deleteCategory = factory.deleteOne(categoryModel);
