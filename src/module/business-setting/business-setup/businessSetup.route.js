const { Router } = require("express");
const router = Router();
const businessSetupController = require("./businessSetup.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const {
  isPostBodyValid,
  isPatchBodyValid,
} = require("./businessSetup.validate");
//
router.post("/", businessSetupController.createBusinessSetup);
router.get("/", businessSetupController.getBusinessSetup);
router.patch("/:id", businessSetupController.updateBusinessSetup);
router.delete("/:id", businessSetupController.deleteBusinessSetup);

module.exports = router;
