import express from "express";
const router = express.Router();
import {
  createGeneric,
  getGenerics,
  getSingleGeneric,
  updateGeneric,
  deleteGeneric,
} from "../controllers/generic.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { genericSchema } from "../schemas/generic.schema.js";
import { validateObjectId } from "../middlewares/validateId.js";
import accessControl from "../middlewares/aceessControl.js";
import { userRoles } from "../config/constants.js";

router.get("/", getGenerics);

router.get("/:id", validateObjectId, getSingleGeneric);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(genericSchema),
  createGeneric
);

router.patch(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  updateGeneric
);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deleteGeneric
);

//
export default router;
