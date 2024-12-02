import express from "express";
const router = express.Router();
import {
  createBrand,
  getBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js"; 
import { brandSchema } from "../schemas/brand.schema.js";

router.get("/", (req, res) => {
  getBrands(req, res);
});

router.get("/:id", (req, res) => {
  getSingleBrand(req, res);
});

router.post("/", validateRequest(brandSchema), (req, res) => {
  createBrand(req, res);
});

router.patch("/:id", (req, res) => {
  updateBrand(req, res);
});

router.delete("/:id", (req, res) => {
  deleteBrand(req, res);
});

//
export default router;
