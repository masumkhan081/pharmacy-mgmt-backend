const { Router } = require("express");
const router = Router();
const bannerController = require("./banner.controller");
//
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles, operableEntities } = require("../../../config/constants");
const {
  fieldsMap,
  uploadHandler,
  uploadBannerThumbnail,
} = require("../../../utils/uploader");
//
router.post("/", uploadBannerThumbnail, bannerController.createBanner);
//
router.get("/", bannerController.getBanners);
//
router.get("/:id", bannerController.getSingleBanner);
// 
router.patch("/:id", uploadBannerThumbnail, bannerController.updateBanner);
//
router.delete(
  "/:id",
  // accessControl([allowedRoles.admin]),
  bannerController.deleteBanner
);

module.exports = router;
