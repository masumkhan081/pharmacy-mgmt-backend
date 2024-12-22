import express from "express";
const router = express.Router();
import {
  createStaff,
  getStaffs,
  getSingleStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { staffSchema } from "../schemas/staff.schema";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";
import { validateObjectId } from "../middlewares/validateId";

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
