import express from "express";
const router = express.Router();
import {
  createAdjustment,
  getAdjustments,
  getSingleAdjustment,
} from "../controllers/inventoryAdjustment.controller";
import validateRequest from "../middlewares/validateRequest";
import { createInventoryAdjustmentSchema } from "../schemas/inventoryAdjustment.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";
import { sensitiveActionRateLimiter } from "../middlewares/rateLimiter";

router.get("/", accessControl([userRoles.admin, userRoles.seller]), getAdjustments);

router.get("/:id", validateObjectId, accessControl([userRoles.admin, userRoles.seller]), getSingleAdjustment);

router.post(
  "/",
  sensitiveActionRateLimiter,
  accessControl([userRoles.admin, userRoles.seller]),
  validateRequest(createInventoryAdjustmentSchema),
  createAdjustment
);

export default router;
