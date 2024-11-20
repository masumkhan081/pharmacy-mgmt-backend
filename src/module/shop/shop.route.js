const { Router } = require("express");
const router = Router();
const shopController = require("./shop.controller");
const { uploadShopCreationFiles } = require("../../utils/uploader");
const { allowedRoles } = require("../../config/constants");
const accessControl = require("../../middlewares/verifyToken");
//
router.post("/", uploadShopCreationFiles, shopController.createShop);
router.get("/", accessControl([allowedRoles.admin]), shopController.getShops);
router.patch(
  "/:id",
  accessControl([allowedRoles.seller]),
  uploadShopCreationFiles,
  shopController.updateShop
);
router.delete(
  "/:id",
  accessControl([allowedRoles.admin]),
  shopController.deleteShop
);
router.patch(
  "/status/:id",
  accessControl([allowedRoles.seller]),
  shopController.updateStatusBySeller
);
router.patch(
  "/admin-approval/:id",
  accessControl([allowedRoles.admin]),
  shopController.updateApprovalByAdmin
);
//
module.exports = router;
