const { Router } = require("express");
const router = Router();
const smsGatewayController = require("./smsGateway.controller");
const { isPostBodyValid, isPatchBodyValid } = require("./smsGateway.validate");
//
router.post("/", smsGatewayController.createSmsGateway);
router.get("/", smsGatewayController.getSmsGateway);
router.patch("/:id", smsGatewayController.updateSmsGateway);
router.delete("/:id", smsGatewayController.deleteSmsGateway);

module.exports = router;
