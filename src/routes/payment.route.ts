import express from "express";
const router = express.Router();
import {
  createPayment,
  getPayments,
  getSinglePayment,
} from "../controllers/payment.controller";
import validateRequest from "../middlewares/validateRequest";
import { createPaymentSchema } from "../schemas/payment.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";
import { sensitiveActionRateLimiter } from "../middlewares/rateLimiter";

router.get("/", getPayments);

router.get("/:id", validateObjectId, getSinglePayment);

router.post(
  "/",
  sensitiveActionRateLimiter,
  accessControl([userRoles.admin, userRoles.seller, userRoles.user]),
  validateRequest(createPaymentSchema),
  createPayment
);

export default router;
