const { Router } = require("express");
const router = Router();
const productController = require("./product.controller");
const { uploadProductImages } = require("../../../utils/uploader");
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles } = require("../../../config/constants");
//
router.post("/", uploadProductImages, productController.createProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getSingleProduct);
router.patch("/:id", uploadProductImages, productController.updateProduct);
//
router.patch(
  "/status/:id",
  accessControl([allowedRoles.seller]),
  productController.updateStatusBySeller
);
//
router.patch(
  "/admin-approval/:id",
  accessControl([allowedRoles.admin]),
  productController.updateApprovalByAdmin
);
//
router.delete(
  "/:id",
  accessControl([allowedRoles.seller]),
  productController.deleteProduct
);
//
module.exports = router;
