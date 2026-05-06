import express from "express";
const router = express.Router();
import {
  createInventoryAlert,
  getInventoryAlerts,
  getSingleInventoryAlert,
  updateInventoryAlert,
  deleteInventoryAlert,
} from "../controllers/inventoryAlert.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createInventoryAlertSchema,
  updateInventoryAlertSchema,
} from "../schemas/inventoryAlert.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getInventoryAlerts);

router.get("/:id", validateObjectId, getSingleInventoryAlert);

router.post(
  "/",
  validateRequest(createInventoryAlertSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  createInventoryAlert
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updateInventoryAlertSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  updateInventoryAlert
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteInventoryAlert
);

export default router;
