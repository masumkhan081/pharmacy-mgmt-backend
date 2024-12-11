import express from "express";
const router = express.Router();

import validateRequest from "../middlewares/validateRequest.js";
import { drugSchema } from "../schemas/drug.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import accessControl from "../middlewares/aceessControl.js";
import { userRoles } from "../config/constants.js";
import {
  getDrugs,
  getSingleDrug,
  updateDrug,
  deleteDrug,
  createDrug,
} from "../controllers/drug.controller.js";
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
