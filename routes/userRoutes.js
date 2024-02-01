const express = require("express");

const router = express.Router();

const {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  updateUserPassword,
  getLoggedInUser,
  updatedLoggedUserPassword,
  updatedLoggedUser,
  deactivateLoggedUser,
  activateLoggedUser,
} = require("../services/userService");

const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  changeMyPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const authService = require("../services/authService");

//Routes

router.use(authService.protect);

router.get("/getMe", getLoggedInUser, getUser);
router.put(
  "/changeMyPassword",
  changeMyPasswordValidator,
  updatedLoggedUserPassword
);
router.put("/updateMe", updateLoggedUserValidator, updatedLoggedUser);
router.put("/activateMe", activateLoggedUser);
router.delete("/deactivateMe", deactivateLoggedUser);

//Admin routes
router.use(authService.allowedTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put("/changePassword/:id", changePasswordValidator, updateUserPassword);

module.exports = router;
