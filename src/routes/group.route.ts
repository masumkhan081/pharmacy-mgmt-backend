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

router.get("/", (req, res) => {
  getGroups(req, res);
});

router.get("/:id", (req, res) => {
  getSingleGroup(req, res);
});

router.post("/", validateRequest(groupSchema), (req, res) => {
  createGroup(req, res);
});

router.patch("/:id", (req, res) => {
  updateGroup(req, res);
});

router.delete("/:id", (req, res) => {
  deleteGroup(req, res);
});

//
export default router;
