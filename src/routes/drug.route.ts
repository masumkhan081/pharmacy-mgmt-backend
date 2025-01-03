import express from "express";
const router = express.Router();

import validateRequest from "../middlewares/validateRequest";
import { drugSchema } from "../schemas/drug.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";
import {
  getDrugs,
  getSingleDrug,
  updateDrug,
  deleteDrug,
  createDrug,
} from "../controllers/drug.controller";
//

router.get("/", getDrugs);

router.get("/:id", validateObjectId, getSingleDrug);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(drugSchema),
  createDrug
);

router.patch(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  updateDrug
);

router.delete(
  "/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  deleteDrug
);

//
export default router;
