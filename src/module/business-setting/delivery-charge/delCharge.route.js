const { Router } = require("express");
const router = Router();
const delChargeController = require("./delCharge.controller");
//
router.post("/", delChargeController.createDeliveryCharge);
router.get("/", delChargeController.getDeliveryCharges);
router.patch("/:id", delChargeController.updateDeliveryCharge);
router.delete("/:id", delChargeController.deleteDeliveryCharge);
//
module.exports = router;

