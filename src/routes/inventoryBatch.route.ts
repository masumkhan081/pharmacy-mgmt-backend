import express from "express";
const router = express.Router();
import {
  createInventoryBatch,
  getInventoryBatches,
  getSingleInventoryBatch,
  updateInventoryBatch,
  deleteInventoryBatch,
} from "../controllers/inventoryBatch.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  createInventoryBatchSchema,
  updateInventoryBatchSchema,
} from "../schemas/inventoryBatch.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

router.get("/", getInventoryBatches);

router.get("/:id", validateObjectId, getSingleInventoryBatch);

router.post(
  "/",
  validateRequest(createInventoryBatchSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  createInventoryBatch
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(updateInventoryBatchSchema),
  accessControl([userRoles.admin, userRoles.seller]),
  updateInventoryBatch
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteInventoryBatch
);

export default router;
