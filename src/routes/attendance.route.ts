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
import { attendanceSchema } from "../schemas/attendance.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import accessControl from "../middlewares/aceessControl.js";
import { userRoles } from "../config/constants.js";

router.get("/", getUnits);

router.get("/:id", getSingleUnit);

router.post("/", validateRequest(attendanceSchema), accessControl([userRoles.admin]), createUnit);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(attendanceSchema),
  accessControl([userRoles.admin]),
  updateUnit
);

router.delete("/:id",  validateObjectId, 
  accessControl([userRoles.admin]), deleteUnit);

//
export default router;
