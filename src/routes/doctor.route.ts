import express from "express";
const router = express.Router();
import {
  createDoctor,
  getDoctors,
  getSingleDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctor.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createDoctorSchema,
  updateDoctorSchema,
} from "../schemas/doctor.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getDoctors);

router.get("/:id", validateObjectId, getSingleDoctor);

router.post(
  "/",
  validateRequest(createDoctorSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  createDoctor
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updateDoctorSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  updateDoctor
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteDoctor
);

export default router;
