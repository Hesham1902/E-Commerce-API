const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: [true, "SubCategory must be unique"],
      minlenght: [2, "Too Short SubCategory name"],
      maxlenght: [32, "Too long SubCategory name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Subcategory must belong to parent category"],
    },
  },
  { timestamps: true }
);

const subCategoryModel = mongoose.model("Subcategory", subCategorySchema);

module.exports = subCategoryModel;
