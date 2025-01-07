import express from "express";
const router = express.Router();
import {
  createManufacturer,
  getManufacturers,
  getSingleManufacturer,
  updateManufacturer,
  deleteManufacturer,
} from "../controllers/mfr.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { manufacturerSchema } from "../schemas/mfr.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";
// 
router.get("/",
  getManufacturers);

router.get(
  "/:id",
  validateObjectId,
  getSingleManufacturer
);

router.post("/",
  accessControl([userRoles.admin]),
  validateRequest(manufacturerSchema),
  createManufacturer);

router.patch("/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  validateRequest(manufacturerSchema),
  updateManufacturer);

router.delete("/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deleteManufacturer);

//
export default router;
