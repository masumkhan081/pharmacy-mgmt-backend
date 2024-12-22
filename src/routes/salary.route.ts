import express from "express";
const router = express.Router();
import {
  createSalary,
  getSalaries,
  getSingleSalary,
  updateSalary,
  deleteSalary,
} from "../controllers/salary.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { salarySchema } from "../schemas/salary.schema";
import { validateObjectId } from "../middlewares/validateId";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";

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
