const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({ data: doc });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build Query
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Get the filtered query and count
    const { filteredQuery } = apiFeatures;
    const count = await Model.countDocuments(filteredQuery);

    //console.log(count);

    // Paginate the query
    const paginatedApiFeatures = apiFeatures.paginate(count);
    const { mongooseQuery, paginationResult } = paginatedApiFeatures;

    // Execute Query
    const docs = await mongooseQuery;

    res.status(200).json({ result: docs.length, paginationResult, docs });
  });

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // 1- build query
    let query = Model.findById(id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    //2) Execute query
    const doc = await query;
    if (!doc) {
      return next(new ApiError(`No doc Found for this id ${id}`, 404));
    }
    res.status(200).json({ data: doc });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document Found for this id ${req.params.id}`, 404)
      );
    }
    //To trigger post save event
    await document.save();
    res.status(201).json({ message: "Document Updated !!", data: document });
  });

exports.deleteOne = (Model, modelName) => {
  return asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let document;
    if (modelName === "Users") {
      document = await Model.findByIdAndUpdate(
        id,
        { active: false }, // Use $set to update specific fields
        { new: true } // To return the modified document
      );
    } else {
      document = await Model.findByIdAndDelete(id);
    }
    if (!document) {
      // return res
      //   .status(404)
      //   .json({ message: `No document Found for this id ${documentId}` });
      return next(new ApiError(`No document Found for this id ${id}`, 404));
    }
    //To trigger post deleteOne event
    //Remeber that document.deleteOne returns query so, you have to put await or exec() so, it returns a promise then it will trigger the deleteOne event

    await document.deleteOne();
    // document.deleteOne().exec();
    
    //204 code means no content to return
    res.status(204).send();
  });
};
