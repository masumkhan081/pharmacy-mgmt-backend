import express from "express";
const router = express.Router();
import {
  createFormulation,
  getFormulations,
  getSingleFormulation,
  updateFormulation,
  deleteFormulation,
} from "../controllers/formulation.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { formulationSchema } from "../schemas/formulation.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";

 

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
