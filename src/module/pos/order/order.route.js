const { Router } = require("express");
const router = Router();
const orderController = require("./order.controller");
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles } = require("../../../config/constants");

// const validateRequest = require("../middlewares/validateRequest");
// const addressSchema = require("../validation/address.validate");

router.post(
  "/",
  // accessControl([allowedRoles.seller, allowedRoles.user]),
  orderController.createOrder
);
router.get("/", orderController.getOrders);
router.patch("/:id", orderController.updateOrder);
router.patch(
  "/order-status/:id",
  // accessControl([allowedRoles.seller]),
  orderController.changeStatus
);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
