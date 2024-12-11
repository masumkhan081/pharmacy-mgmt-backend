import express from "express";
const router = express.Router();
import {
  createPurchase,
  getPurchases,
  getSinglePurchase,
  updatePurchase,
  deletePurchase,
} from "../controllers/purchase.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { purchaseSchema } from "../schemas/purchase.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import accessControl from "../middlewares/aceessControl.js";
import { userRoles } from "../config/constants.js";

router.get("/", getPurchases);

router.get(
  "/:id",

  validateObjectId,
  getSinglePurchase
);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(purchaseSchema),
  createPurchase
);

router.patch(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  updatePurchase
);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deletePurchase
);

//
export default router;
