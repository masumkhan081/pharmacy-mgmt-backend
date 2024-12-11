import express from "express";
const router = express.Router();
import {
  createSalary,
  getSalaries,
  getSingleSalary,
  updateSalary,
  deleteSalary,
} from "../controllers/salary.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { salarySchema } from "../schemas/salary.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import { userRoles } from "../config/constants.js";
import accessControl from "../middlewares/aceessControl.js";

router.get("/", getSalaries);

router.get("/:id", validateObjectId, getSingleSalary);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(salarySchema),
  createSalary
);

router.patch(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  updateSalary
);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deleteSalary
);

//
export default router;
