import express from "express";
const router = express.Router();
import {
  createFormulation,
  getFormulations,
  getSingleFormulation,
  updateFormulation,
  deleteFormulation,
} from "../controllers/formulation.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { formulationSchema } from "../schemas/formulation.schema.js";

router.get("/", (req, res) => {
  getFormulations(req, res);
});

router.get("/:id", (req, res) => {
  getSingleFormulation(req, res);
});

router.post("/", validateRequest(formulationSchema), (req, res) => {
  createFormulation(req, res);
});

router.patch("/:id", (req, res) => {
  updateFormulation(req, res);
});

router.delete("/:id", (req, res) => {
  deleteFormulation(req, res);
});

//
export default router;
