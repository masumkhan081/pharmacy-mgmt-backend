import express from "express";
const router = express.Router();
import {
  createPayment,
  getPayments,
  getSinglePayment,
  updatePayment,
  deletePayment,
} from "../controllers/payment.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createPaymentSchema,
  updatePaymentSchema,
} from "../schemas/payment.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getPayments);

router.get("/:id", validateObjectId, getSinglePayment);

router.post(
  "/",
  validateRequest(createPaymentSchema),
  accessControl([userRoles.admin, userRoles.seller, userRoles.user]),
  createPayment
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updatePaymentSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  updatePayment
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deletePayment
);

export default router;
