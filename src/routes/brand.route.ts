import express from "express";
const router = express.Router();
import {
  createBrand,
  getBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { brandSchema, brandUpdateSchema } from "../schemas/brand.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";
//
router.get("/", getBrands);

router.get("/:id", validateObjectId, getSingleBrand);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(brandSchema),
  createBrand
);

router.patch(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  validateRequest(brandUpdateSchema),
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
