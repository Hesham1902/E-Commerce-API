const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  //1- DiskStorage engine
  // const multerStroage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: function (req, file, cb) {
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${uuid()}-${Date.now()}.${ext}`;
  //     cb(null, filename);
  //   },
  // });

  //2- MemoryStorage engine
  const multerStroage = multer.memoryStorage();

  const multerFilter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Only images allowed", 400), false);
    }
  };
  const upload = multer({ storage: multerStroage, fileFilter: multerFilter });
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultiImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
