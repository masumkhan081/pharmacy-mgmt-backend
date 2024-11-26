import express from "express";
const router = express.Router();
import {
  getFormulations,
  saveFormulation,
  updateFormulation,
  deleteFormulation,
} from "../controllers/formulation.js";
//
router.get("/", (req, res) => {
  getFormulations(req, res);
});
router.post("/", (req, res) => {
  saveFormulation(req, res);
});
router.patch("/", (req, res) => {
  updateFormulation(req, res);
});
router.delete("/:id", (req, res) => {
  deleteFormulation(req, res);
});

export default router;
