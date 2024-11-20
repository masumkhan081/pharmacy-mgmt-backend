const { Router } = require("express");
const router = Router();
const fs = require("fs");
const path = require("path");
//
const generalSettingController = require("./generalSetting.controller");
const {
  isPostBodyValid,
  isPatchBodyValid,
} = require("./generalSetting.validate");
const { uploadGeneralSettingFiles } = require("../../../utils/uploader");
const { operableEntities } = require("../../../config/constants");
//
// router.post("/", generalSettingController.createGeneralSetting);
router.post(
  "/",
  uploadGeneralSettingFiles,
  generalSettingController.createGeneralSetting
);
router.get("/", generalSettingController.getGeneralSettings);
router.patch(
  "/:id",
  uploadGeneralSettingFiles,
  generalSettingController.updateGeneralSetting
);
router.delete("/:id", generalSettingController.deleteGeneralSetting);
//
module.exports = router;
