const { Router } = require("express");
const router = Router();
const cartController = require("./cart.controller");
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles } = require("../../../config/constants");
const validateRequest = require("../../../middlewares/validateRequest");
const { cartSchema } = require("./cart.validate");
//
router.post(
  "/",
  accessControl([allowedRoles.customer]),
  validateRequest(cartSchema),
  cartController.manageCart
);
//
router.post("/cart-checkout", cartController.createOrderFromCart);
//
router.get("/", cartController.getCarts);
//
// router.patch(
//   "/:id",
//   accessControl([allowedRoles.customer]),
//   cartController.updateCart
// );
//
router.delete("/:id", cartController.deleteCart);

module.exports = router;
