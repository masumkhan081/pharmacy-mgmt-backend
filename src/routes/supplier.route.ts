import express from "express";
const router = express.Router();
import {
  createSupplier,
  getSuppliers,
  getSingleSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplier.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { supplierSchema } from "../schemas/supplier.schema.js";

router.get("/", (req, res) => {
  getSuppliers(req, res);
});

router.get("/:id", (req, res) => {
  getSingleSupplier(req, res);
});

router.post("/", validateRequest(supplierSchema), (req, res) => {
  createSupplier(req, res);
});

router.patch("/:id", (req, res) => {
  updateSupplier(req, res);
});

router.delete("/:id", (req, res) => {
  deleteSupplier(req, res);
});

//
export default router;
