const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "email required"],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, "password required"],
      minLength: [6, "password too short"],
    },

    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    // lastToken: String,
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    //Child reference
    wishList: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

//pre ==> query
//post ==> document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //Hashing user password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const setImageURL = (doc) => {
  if (doc.profileImg) {
    const profileImgUrl = `${process.env.BASE_URL}/users/${doc.profileImg}`;
    doc.profileImg = profileImgUrl;
  }
};

userSchema.post("init", (doc) => {
  setImageURL(doc);
});

userSchema.post("save", function (next) {
  setImageURL(this);
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
