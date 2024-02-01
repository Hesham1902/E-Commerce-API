const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");

// @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc    Remove address from addresses list
// @route   DELETE /api/v1/addresses/:id
// @access  Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Address removed successfully",
    data: user.addresses,
  });
});

// @desc    Update address IN addresses list
// @route   PUT /api/v1/addresses/:id
// @access  Protected/User
exports.updateAddress = asyncHandler(async (req, res, next) => {
  // const result = await userModel.updateOne(
  //   { _id: req.user._id, "addresses._id": req.params.addressId },
  //   {
  //     $set: {
  //       "addresses.$.alias": req.body.alias,
  //       "addresses.$.details": req.body.details,
  //       "addresses.$.phone": req.body.phone,
  //       "addresses.$.city": req.body.city,
  //       "addresses.$.postalCode": req.body.postalCode,
  //       //         This Will generate new ObjectId
  //       //        "addresses.$": req.body,
  //     },
  //   }
  // );
  const result = await userModel.findOneAndUpdate(
    {
      _id: req.user._id,
      "addresses._id": req.params.addressId,
    },
    {
      $set: {
        "addresses.$.alias": req.body.alias,
        "addresses.$.details": req.body.details,
        "addresses.$.phone": req.body.phone,
        "addresses.$.city": req.body.city,
        "addresses.$.postalCode": req.body.postalCode,
      },
    },
    { new: true } // To return the updated document
  );
  res.status(200).json({
    status: "success",
    message: "Address updated successfully",
    data: result,
  });
});

// @desc    Get logged user addresses
// @route   GET /api/v1/addresses
// @access  Protected/User
exports.getUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id);

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
