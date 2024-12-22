import express from "express";
const router = express.Router();
import {
  createSale,
  getSales,
  getSingleSale,
  updateSale,
  deleteSale,
} from "../controllers/sale.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { saleSchema } from "../schemas/sale.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";

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
