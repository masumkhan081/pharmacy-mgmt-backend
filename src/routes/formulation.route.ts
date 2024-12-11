import express from "express";
const router = express.Router();
import {
  createFormulation,
  getFormulations,
  getSingleFormulation,
  updateFormulation,
  deleteFormulation,
} from "../controllers/formulation.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { formulationSchema } from "../schemas/formulation.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import accessControl from "../middlewares/aceessControl.js";
import { userRoles } from "../config/constants.js";

 

router.get("/",
  getFormulations);

router.get("/:id",
  validateObjectId,
  getSingleFormulation);

router.post("/",accessControl([userRoles.admin]), validateRequest(formulationSchema), createFormulation);

router.patch("/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  updateFormulation);

router.delete("/:id",accessControl([userRoles.admin]),validateObjectId,
  deleteFormulation);

//
export default router;
