import express from "express";
const router = express.Router();
import {
  createPurchase,
  getPurchases,
  getSinglePurchase,
  deletePurchase,
} from "../controllers/purchase.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { purchaseSchema } from "../schemas/purchase.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";

router.get("/", getPurchases);

router.get(
  "/:id",

  validateObjectId,
  getSinglePurchase
);

router.post(
  "/",
  accessControl([userRoles.admin, userRoles.seller]),
  validateRequest(purchaseSchema),
  createPurchase
);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deletePurchase
);

//
export default router;
