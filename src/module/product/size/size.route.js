const { Router } = require("express");
const router = Router();
const sizeController = require("./size.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { sizeSchema, sizeStatusSchema } = require("./size.validate");
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles } = require("../../../config/constants");
//
router.post(
  "/",
  accessControl([allowedRoles.seller]),
  validateRequest(sizeSchema),
  sizeController.createSize
);
router.get("/", accessControl([allowedRoles.seller]), sizeController.getSizes);
//
router.get(
  "/:id",
  accessControl([allowedRoles.seller]),
  sizeController.getSingleSize
);
//
router.patch(
  "/:id",
  accessControl([allowedRoles.seller]),
  sizeController.updateSize
);
//
router.patch(
  "/status/:id",
  accessControl([allowedRoles.seller]),
  validateRequest(sizeStatusSchema),
  sizeController.updateSizeStatus
);
//
router.delete(
  "/:id",
  accessControl([allowedRoles.seller]),
  sizeController.deleteSize
);

module.exports = router;
