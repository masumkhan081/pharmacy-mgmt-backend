import express from "express";
const router = express.Router();
import {
  createReturn,
  getReturns,
  getSingleReturn,
  approveReturn,
  rejectReturn,
  deleteReturn,
} from "../controllers/return.controller";
import validateRequest from "../middlewares/validateRequest";
import { createReturnSchema } from "../schemas/return.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getReturns);

router.get("/:id", validateObjectId, getSingleReturn);

router.post(
  "/",
  accessControl([userRoles.admin, userRoles.seller, userRoles.user]),
  validateRequest(createReturnSchema),
  createReturn
);

// Explicit approval — triggers transactional inventory restoration
router.post(
  "/:id/approve",
  validateObjectId,
  accessControl([userRoles.admin, userRoles.seller]),
  approveReturn
);

// Explicit rejection — no inventory change
router.post(
  "/:id/reject",
  validateObjectId,
  accessControl([userRoles.admin, userRoles.seller]),
  rejectReturn
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteReturn
);

export default router;

