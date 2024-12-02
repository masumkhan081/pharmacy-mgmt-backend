import express from "express";
const router = express.Router();
import {
  createStaff,
  getStaffs,
  getSingleStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { staffSchema } from "../schemas/staff.schema.js";

router.get("/", (req, res) => {
  getStaffs(req, res);
});

router.get("/:id", (req, res) => {
  getSingleStaff(req, res);
});

router.post("/", validateRequest(staffSchema), (req, res) => {
  createStaff(req, res);
});

router.patch("/:id", (req, res) => {
  updateStaff(req, res);
});

router.delete("/:id", (req, res) => {
  deleteStaff(req, res);
});

//
export default router;
