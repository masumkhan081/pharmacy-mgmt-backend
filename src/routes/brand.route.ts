import express from "express";
const router = express.Router();
import {
  createBrand,
  getBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { brandSchema } from "../schemas/brand.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import accessControl from "../middlewares/aceessControl.js";
import { userRoles } from "../config/constants.js";
//
router.get("/", getBrands);

router.get("/:id", validateObjectId, getSingleBrand);

router.post(
  "/",
  validateRequest(brandSchema),
  accessControl([userRoles.admin]),
  createBrand
);

router.patch(
  "/:id",
  validateObjectId,
  validateRequest(brandSchema),
  accessControl([userRoles.admin]),
  updateBrand
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteBrand
);

//
export default router;
