const subCategoryModel = require("../models/subCategoryModel");
const factory = require("./handlersFactory");

//Nested route for (Create)
exports.setCategoryIdToBody = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.id;
  next();
};

//Nested route for (Get)
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.id) {
    filterObject = { category: req.params.id };
  }
  req.filterObj = filterObject;
  next();
};

exports.getSubCategories = factory.getAll(subCategoryModel);

exports.getSubCategory = factory.getOne(subCategoryModel);

exports.createSubCategories = factory.createOne(subCategoryModel);

exports.updateSubCategory = factory.updateOne(subCategoryModel);

exports.deleteCategory = factory.deleteOne(subCategoryModel);
