import express from "express";
const router = express.Router();
import {
  createSupplier,
  getSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { supplierSchema } from "../schemas/supplier.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";

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
