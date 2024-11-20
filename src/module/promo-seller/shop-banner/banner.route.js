const { Router } = require("express");
const router = Router();
const bannerController = require("./banner.controller");
const { isPatchBodyValid, isPostBodyValid } = require("./banner.validate");
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles } = require("../../../config/constants");
const { uploadShopBanner } = require("../../../utils/uploader");
//
router.post("/", accessControl([allowedRoles.admin]),uploadShopBanner, bannerController.createBanner);
router.get("/", bannerController.getBanners);
router.patch("/:id", uploadShopBanner, bannerController.updateBanner);
router.delete(
  "/:id",
  // accessControl([allowedRoles.admin]),
  bannerController.deleteBanner
);

module.exports = router;
