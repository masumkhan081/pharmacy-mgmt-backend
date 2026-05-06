import express from "express";
const router = express.Router();
import {
  createSupplier,
  getSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  supplierSchema,
  updateSupplierSchema,
} from "../schemas/supplier.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";

router.get("/", getSuppliers);

router.get("/:id", validateObjectId, getSingleSupplier);

router.post(
  "/",
  validateRequest(supplierSchema),
  accessControl([userRoles.admin]),
  createSupplier
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updateSupplierSchema),
  accessControl([userRoles.admin]),
  updateSupplier
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteSupplier
);

export default router;
