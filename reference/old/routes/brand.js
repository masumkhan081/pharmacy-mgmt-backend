import express from "express";
const router = express.Router();
//------------------------------------------------     model & controller
import {
  getBrands,
  saveBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brand.js";
//

router.get("/", (req, res) => {
  getBrands(req, res);
});

router.post("/", (req, res) => {
  saveBrand(req, res);
});

router.patch("/", (req, res) => {
  updateBrand(req, res);
});

router.delete("/:id", (req, res) => {
  deleteBrand(req, res);
});

export default router;
