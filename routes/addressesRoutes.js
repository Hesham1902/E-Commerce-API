const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  addAddress,
  removeAddress,
  getUserAddresses,
  updateAddress,
} = require("../services/addressesService");

const {
  addAddressValidator,
  updateAddressValidator,
} = require("../utils/validators/addressesValidator");

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").get(getUserAddresses).post(addAddressValidator, addAddress);

router
  .route("/:addressId")
  .put(updateAddressValidator, updateAddress)
  .delete(removeAddress);

module.exports = router;
