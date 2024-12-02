import express from "express";
const router = express.Router();
import {
  createUnit,
  getUnits,
  getSingleUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unit.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { unitSchema } from "../schemas/unit.schema.js";

router.get("/", (req, res) => {
  getUnits(req, res);
});

router.get("/:id", (req, res) => {
  getSingleUnit(req, res);
});

router.post("/", validateRequest(unitSchema), (req, res) => {
  createUnit(req, res);
});

router.patch("/:id", (req, res) => {
  updateUnit(req, res);
});

router.delete("/:id", (req, res) => {
  deleteUnit(req, res);
});

//
export default router;
