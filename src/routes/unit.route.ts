import express from "express";
const router = express.Router();
import {
  createUnit,
  getUnits,
  getSingleUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unit.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { unitSchema } from "../schemas/unit.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
// import { TypeController } from "../types/requestResponse.js";
import { userRoles } from "../config/constants.js";
import accessControl from "../middlewares/aceessControl.js";

router.get("/", getUnits);

router.get("/:id", validateObjectId, getSingleUnit);

router.post(
  "/",
  validateRequest(unitSchema),
  accessControl([userRoles.admin]),
  createUnit
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(unitSchema),
  accessControl([userRoles.admin]),
  updateUnit
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteUnit
);

//
export default router;
