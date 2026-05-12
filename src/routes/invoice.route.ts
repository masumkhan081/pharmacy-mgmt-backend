import express from "express";
const router = express.Router();
import {
  createInvoice,
  getInvoices,
  getSingleInvoice,
  deleteInvoice,
} from "../controllers/invoice.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createInvoiceSchema,
} from "../schemas/invoice.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getInvoices);

router.get("/:id", validateObjectId, getSingleInvoice);

router.post(
  "/",
  validateRequest(createInvoiceSchema),
  accessControl([userRoles.admin, userRoles.seller, userRoles.user]),
  createInvoice
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteInvoice
);

export default router;
