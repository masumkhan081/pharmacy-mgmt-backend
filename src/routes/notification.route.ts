import express from "express";
const router = express.Router();
import {
  createNotification,
  getNotifications,
  getSingleNotification,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createNotificationSchema,
  updateNotificationSchema,
} from "../schemas/notification.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getNotifications);

router.get("/:id", validateObjectId, getSingleNotification);

router.post(
  "/",
  validateRequest(createNotificationSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  createNotification
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updateNotificationSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  updateNotification
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteNotification
);

export default router;
