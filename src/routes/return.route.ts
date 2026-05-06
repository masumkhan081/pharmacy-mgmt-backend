import express from "express";
const router = express.Router();
import {
  createReturn,
  getReturns,
  getSingleReturn,
  updateReturn,
  deleteReturn,
} from "../controllers/return.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createReturnSchema,
  updateReturnSchema,
} from "../schemas/return.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getReturns);

router.get("/:id", validateObjectId, getSingleReturn);

router.post(
  "/",
  validateRequest(createReturnSchema),
  accessControl([userRoles.admin, userRoles.seller, userRoles.user]),
  createReturn
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updateReturnSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  updateReturn
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteReturn
);

export default router;
