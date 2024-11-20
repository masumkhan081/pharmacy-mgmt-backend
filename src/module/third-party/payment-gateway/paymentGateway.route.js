const { Router } = require("express");
const router = Router();
const paymentGatewayController = require("./paymentGateway.controller"); 
const {} = require("./paymentGateway.validate");
//
router.post("/",   paymentGatewayController.createPaymentGateway);
router.get("/", paymentGatewayController.getPaymentGateway);
router.patch("/:id", paymentGatewayController.updatePaymentGateway);
router.delete("/:id", paymentGatewayController.deletePaymentGateway);

module.exports = router;
