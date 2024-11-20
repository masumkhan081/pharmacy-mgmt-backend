const { Router } = require("express");
const router = Router();
const unitController = require("./unit.controller");
const validateRequest = require("../../../middlewares/validateRequest");
const { unitSchema, unitStatusSchema } = require("./unit.validate");
const accessControl = require("../../../middlewares/verifyToken");
const { allowedRoles } = require("../../../config/constants");
//
router.post(
  "/",
  accessControl([allowedRoles.seller]),
  validateRequest(unitSchema),
  unitController.createUnit
);
router.get("/", accessControl([allowedRoles.seller]), unitController.getUnits);
//
router.get(
  "/:id",
  accessControl([allowedRoles.seller]),
  unitController.getSingleUnit
);
//
router.patch(
  "/:id",
  accessControl([allowedRoles.seller]),
  unitController.updateUnit
);
//
router.patch(
  "/status/:id",
  accessControl([allowedRoles.seller]),
  validateRequest(unitStatusSchema),
  unitController.updateUnitStatus
);
//
router.delete(
  "/:id",
  accessControl([allowedRoles.seller]),
  unitController.deleteUnit
);

module.exports = router;
