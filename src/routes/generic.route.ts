import express from "express";
const router = express.Router();
import {
  createGeneric,
  getGenerics,
  getSingleGeneric,
  updateGeneric,
  deleteGeneric,
} from "../controllers/generic.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { genericSchema } from "../schemas/generic.schema";
import { validateObjectId } from "../middlewares/validateId";
import accessControl from "../middlewares/aceessControl";
import { userRoles } from "../config/constants";

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
