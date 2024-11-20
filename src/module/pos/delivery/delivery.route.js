const { Router } = require("express");
const router = Router();
const deliveryController = require("./delivery.controller");
const validateRequest = require("../../../middlewares/validateRequest");
//
router.post("/", deliveryController.createDelivery);
router.get("/", deliveryController.getDeliveries);
router.patch("/:id", deliveryController.updateDelivery);
router.delete("/:id", deliveryController.deleteDelivery);

module.exports = router;
