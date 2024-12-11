import express from "express";
const router = express.Router();
import {
  createSale,
  getSales,
  getSingleSale,
  updateSale,
  deleteSale,
} from "../controllers/sale.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { saleSchema } from "../schemas/sale.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import accessControl from "../middlewares/aceessControl.js";
import { userRoles } from "../config/constants.js";

router.get("/", getSales);

router.get("/:id", validateObjectId, getSingleSale);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(saleSchema),
  createSale
);

router.patch(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  updateSale
);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deleteSale
);

//
export default router;
