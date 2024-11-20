const { Router } = require("express");
const router = Router();
const mailConfigController = require("./mailConfig.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { isPatchBodyValid, isPostBodyValid } = require("./mailConfig.validate");
//
router.post("/", mailConfigController.createMailConfig);
router.get("/", mailConfigController.getMailConfig);
router.patch("/:id", mailConfigController.updateMailConfig);
router.delete("/:id", mailConfigController.deleteMailConfig);
//
module.exports = router;
