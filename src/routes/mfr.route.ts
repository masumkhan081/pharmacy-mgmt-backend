import express from "express";
const router = express.Router();
import {
  createManufacturer,
  getManufacturers,
  getSingleManufacturer,
  updateManufacturer,
  deleteManufacturer,
} from "../controllers/mfr.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { manufacturerSchema } from "../schemas/mfr.schema.js";

router.get("/", (req, res) => {
  getManufacturers(req, res);
});

router.get("/:id", (req, res) => {
  getSingleManufacturer(req, res);
});

router.post("/", validateRequest(manufacturerSchema), (req, res) => {
  createManufacturer(req, res);
});

router.patch("/:id", (req, res) => {
  updateManufacturer(req, res);
});

router.delete("/:id", (req, res) => {
  deleteManufacturer(req, res);
});

//
export default router;
