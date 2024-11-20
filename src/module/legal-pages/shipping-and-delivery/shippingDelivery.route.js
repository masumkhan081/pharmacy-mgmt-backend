const { Router } = require("express");
const router = Router();
const shippingDeliveryPolicyController = require("./shippingDelivery.controller");
// const validateRequest = require("../../../middlewares/validateRequest");
const {
  isPatchBodyValid,
  isPostBodyValid,
} = require("./shippingDelivery.validate");
//
router.post("/", shippingDeliveryPolicyController.createShippingDeliveryPolicy);
router.get("/", shippingDeliveryPolicyController.getShippingDeliveryPolicy);
router.patch(
  "/:id",
  shippingDeliveryPolicyController.updateShippingDeliveryPolicy
);
router.delete(
  "/:id",
  shippingDeliveryPolicyController.deleteShippingDeliveryPolicy
);

module.exports = router;
