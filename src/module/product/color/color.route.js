const { Router } = require("express");
const router = Router();
const colorController = require("./color.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { colorSchema } = require("./color.validate");
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles } = require("../../../config/constants");

router.post(
  "/",
  accessControl([allowedRoles.seller]),
  validateRequest(colorSchema),
  colorController.createColor
);
router.get("/", accessControl([allowedRoles.seller]), colorController.getColors);
//
router.get(
  "/:id",
  accessControl([allowedRoles.seller]),
  colorController.getSingleColor
);
//
router.patch(
  "/:id",
  accessControl([allowedRoles.seller]),
  colorController.updateColor
);
//
router.patch(
  "/status/:id",
  accessControl([allowedRoles.seller]), 
  colorController.updateColorStatus
);
//
router.delete(
  "/:id",
  accessControl([allowedRoles.seller]),
  colorController.deleteColor
);

module.exports = router;
