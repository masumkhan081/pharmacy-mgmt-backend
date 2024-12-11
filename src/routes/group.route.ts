import express from "express";
const router = express.Router();
import {
  createGroup,
  getGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { groupSchema } from "../schemas/group.schema.js";
import { userRoles } from "../config/constants.js";
import accessControl from "../middlewares/aceessControl.js";
import { validateObjectId } from "../middlewares/validateId.js";

router.get("/", getGroups);

router.get("/:id", validateObjectId, getSingleGroup);

router.post(
  "/",

  accessControl([userRoles.admin]),
  validateRequest(groupSchema),
  createGroup
);

router.patch("/:id", validateObjectId, updateGroup);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deleteGroup
);

//
export default router;
