const { Router } = require("express");
const router = Router();
const withdrawSetupController = require("./withdrawSetup.controller");
const validateRequest = require("../../../middlewares/validateRequest");
//

router.post("/", withdrawSetupController.createWithdrawSetting);
router.get("/", withdrawSetupController.getWithdrawSettings);
router.patch("/:id", withdrawSetupController.updateWithdrawSetting);
router.delete("/:id", withdrawSetupController.deleteWithdrawSetting);

module.exports = router;
