import express from "express";
const router = express.Router();
import {
  createStaff,
  getStaffs,
  getSingleStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { staffSchema } from "../schemas/staff.schema.js";
import { userRoles } from "../config/constants.js";
import accessControl from "../middlewares/aceessControl.js";
import { validateObjectId } from "../middlewares/validateId.js";

router.get("/", getStaffs);

router.get("/:id", validateObjectId, getSingleStaff);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(staffSchema),
  createStaff
);

router.patch(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  updateStaff
);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deleteStaff
);

//
export default router;
