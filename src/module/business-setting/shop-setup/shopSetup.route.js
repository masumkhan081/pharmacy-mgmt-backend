const { Router } = require("express");
const router = Router();
const shopSettingController = require("./shopSetup.controller");
// const validateRequest = require("../../../middlewares/validateRequest");
const { isPostBodyValid, isPatchBodyValid } = require("./shopSetup.validate");
//
router.post("/", shopSettingController.createShopSetup);
router.get("/", shopSettingController.getShopSettings);
router.patch("/:id", shopSettingController.updateShopSetting);
router.delete("/:id", shopSettingController.deleteShopSetting);

module.exports = router;
