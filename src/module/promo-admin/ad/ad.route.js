const { Router } = require("express");
const router = Router();
const adController = require("./ad.controller");
const { uploadAdThumbnail } = require("../../../utils/uploader");
//
router.post("/", uploadAdThumbnail, adController.createAd);
router.get("/", adController.getAds);
router.get("/:id", adController.getSingleAd);
router.patch("/:id", uploadAdThumbnail, adController.updateAd);
router.delete("/:id", adController.deleteAd);
//
module.exports = router;
