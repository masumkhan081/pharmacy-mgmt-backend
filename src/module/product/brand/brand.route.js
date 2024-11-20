const { Router } = require("express");
const router = Router();
const brandController = require("./brand.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { brandSchema ,brandStatusSchema} = require("./brand.validate");
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles } = require("../../../config/constants");
const { uploadBrandLogo } = require("../../../utils/uploader");
//
router.post(
  "/",
  accessControl([allowedRoles.seller]),
  uploadBrandLogo,
  validateRequest(brandSchema),
  brandController.createBrand
);
//
router.get("/", accessControl([allowedRoles.seller]), brandController.getBrands);
//
router.get(
  "/:id",
  accessControl([allowedRoles.seller]),
  brandController.getSingleBrand
);
//
router.patch(
  "/:id",
  accessControl([allowedRoles.seller]),
  uploadBrandLogo, 
  brandController.updateBrand
);
//
router.patch(
  "/status/:id",
  accessControl([allowedRoles.seller]), 
  validateRequest(brandStatusSchema),
  brandController.updateBrandStatus
);
//
router.delete(
  "/:id",
  accessControl([allowedRoles.seller]),
  brandController.deleteBrand
);

module.exports = router;
