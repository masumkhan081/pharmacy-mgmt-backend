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
import { attendanceSchema } from "../schemas/attendance.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";

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
