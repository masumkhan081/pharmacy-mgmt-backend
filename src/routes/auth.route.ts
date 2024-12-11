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

router.get("/", getUnits);

router.get("/:id", getSingleUnit);

router.post("/", validateRequest(unitSchema), createUnit);

router.patch("/:id", updateUnit);

router.delete("/:id", deleteUnit);

//
export default router;
