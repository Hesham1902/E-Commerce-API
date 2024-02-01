const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  createCashOrder,
  findAllOrders,
  createFilterObj,
  findSpecificOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
  checkoutSession,
} = require("../services/orderService");

const {
  createCashOrderValidator,
  getOneOrderValidator,
} = require("../utils/validators/orderValidator");

router.use(authService.protect);

//Routes

router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  checkoutSession
);

router
  .route("/")
  .get(
    authService.allowedTo("user", "admin", "manager"),
    createFilterObj,
    findAllOrders
  );

router.get(
  "/:id",
  authService.allowedTo("user"),
  getOneOrderValidator,
  findSpecificOrder
);
router.post(
  "/:cartId",
  authService.allowedTo("user"),
  createCashOrderValidator,
  createCashOrder
);

router.put(
  "/:orderId/delivered",
  authService.allowedTo("admin", "manager"),
  updateOrderToDelivered
);
router.put(
  "/:orderId/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid
);
module.exports = router;
