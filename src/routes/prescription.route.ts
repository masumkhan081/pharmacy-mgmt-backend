import express from "express";
const router = express.Router();
import {
  createPrescription,
  getPrescriptions,
  getSinglePrescription,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescription.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createPrescriptionSchema,
  updatePrescriptionSchema,
} from "../schemas/prescription.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getPrescriptions);

router.get("/:id", validateObjectId, getSinglePrescription);

router.post(
  "/",
  validateRequest(createPrescriptionSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  createPrescription
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updatePrescriptionSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  updatePrescription
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deletePrescription
);

export default router;
