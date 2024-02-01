const mongoose = require("mongoose");

const productModel = require("./productModel");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "Min rating value is 1.0"],
      max: [5, "Max rating value is 5.0"],
      required: [true, "review ratings is required"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Review must belong to user"],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email -_id",
  });
  next();
});

reviewSchema.statics.calcAvgAndQty = async function (productId) {
  const result = await this.aggregate([
    // Stage 1: get all review in specific product
    { $match: { product: productId } },
    // Stage 2: group review by product id and calculate averageRatings and calculate ratingsQuantity
    {
      $group: {
        _id: "product",
        avgRatings: { $avg: "$ratings" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  console.log(result);
  
  if (result.length > 0) {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingQuantites: result[0].ratingsQuantity,
    });
    console.log(result[0]._id);
  } else {
    await productModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingQuantites: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  console.log("Iam in save Event");
  // this.constructor returns the model instance
  await this.constructor.calcAvgAndQty(this.product);
});

reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    console.log("Iam in deleteOne Event");
    // this.constructor returns the model instance
    await this.constructor.calcAvgAndQty(this.product);
  }
);

module.exports = mongoose.model("Review", reviewSchema);
