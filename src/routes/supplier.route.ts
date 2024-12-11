import express from "express";
const router = express.Router();
import {
  createSupplier,
  getSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { supplierSchema } from "../schemas/supplier.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import accessControl from "../middlewares/aceessControl.js";
import { userRoles } from "../config/constants.js";

router.get("/", getSuppliers);

router.get("/:id", validateObjectId, getSingleSupplier);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(supplierSchema),
  createSupplier
);

router.patch(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  updateSupplier
);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deleteSupplier
);

//
export default router;
