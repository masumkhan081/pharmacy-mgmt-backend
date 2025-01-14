import express from "express";
const router = express.Router();
import {
  createGroup,
  getGroups,
  getSingleGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/group.controller"; // controller functions
import validateRequest from "../middlewares/validateRequest";
import { groupSchema } from "../schemas/group.schema";
import { userRoles } from "../config/constants";
import accessControl from "../middlewares/aceessControl";
import { validateObjectId } from "../middlewares/validateId";

router.get("/", getGroups);

router.get("/:id", validateObjectId, getSingleGroup);

router.post(
  "/",
  accessControl([userRoles.admin]),
  validateRequest(groupSchema),
  createGroup
);

router.patch("/:id",
  validateObjectId,
  accessControl([userRoles.admin]),
  validateRequest(groupSchema), updateGroup);

router.delete(
  "/:id",
  accessControl([userRoles.admin]),
  validateObjectId,
  deleteGroup
);

//
export default router;
