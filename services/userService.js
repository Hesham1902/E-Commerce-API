const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { uuid } = require("uuidv4");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");

exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuid()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`);

    //save image into database
    req.body.profileImg = filename;
  }

  next();
});

exports.uploadUserImage = uploadSingleImage("profileImg");

exports.getUsers = factory.getAll(userModel);

exports.getUser = factory.getOne(userModel);

exports.createUser = factory.createOne(userModel);

exports.deleteUser = factory.deleteOne(userModel, "Users");

exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      active: req.body.active,
      profileImg: req.body.profileImg,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(
      new ApiError(`No document Found for this id ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ message: "Document Updated !!", data: document });
});

exports.updateUserPassword = asyncHandler(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: hashedPassword,
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!document) {
    return next(
      new ApiError(`No document Found for this id ${req.params.id}`, 404)
    );
  }
  res.status(201).json({ message: "Password Updated !!", data: document });
});

exports.getLoggedInUser = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError("Your are not logged in", 400));
  }
  req.params.id = req.user._id;
  next();
});

exports.updatedLoggedUserPassword = asyncHandler(async (req, res, next) => {
  //1) updated user password based on user payload (req.user._id)
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      password: hashedPassword,
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return next(
      new ApiError(`No document Found for this id ${req.params.id}`, 404)
    );
  }

  // 2) Generate the token
  const token = createToken(user._id);

  res.status(200).json({ message: "password updated !", data: user, token });
});

exports.updatedLoggedUser = asyncHandler(async (req, res, next) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.status(200).json({ date: updatedUser });
});

exports.deactivateLoggedUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      active: false,
    },
    { new: true }
  );
  res.status(200).json("account deactivated");
});

exports.activateLoggedUser = asyncHandler(async (req, res, next) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      active: true,
    },
    { new: true }
  );
  res.status(200).json("Account activated");
});
