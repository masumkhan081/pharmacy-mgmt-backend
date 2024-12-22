import express from "express";
const router = express.Router();
import {
  createUnit,
  getUnits,
  getSingleUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unit.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { unitSchema } from "../schemas/unit.schema";
import { validateObjectId } from "../middlewares/validateId";
// import { TypeController } from "../types/requestResponse";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

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
