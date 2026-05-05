import express from "express";
const router = express.Router();
import {
  createAttendance,
  getAttendances,
  getSingleAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller";
import validateRequest from "../middlewares/validateRequest";
import { attendanceSchema } from "../schemas/attendance.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";

router.get("/", getAttendances);

router.get("/:id", validateObjectId, getSingleAttendance);

router.post(
  "/",
  validateRequest(attendanceSchema),
  accessControl([userRoles.admin]),
  createAttendance
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(attendanceSchema),
  accessControl([userRoles.admin]),
  updateAttendance
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteAttendance
);

export default router;
