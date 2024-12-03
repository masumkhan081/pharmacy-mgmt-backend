import express from "express";
const router = express.Router();
import {
  createGeneric,
  getGenerics,
  getSingleGeneric,
  updateGeneric,
  deleteGeneric,
} from "../controllers/generic.controller.js"; // controller functions
import validateRequest from "../middlewares/validateRequest.js";
import { genericSchema } from "../schemas/generic.schema.js";

router.get("/", (req, res) => {
  getGenerics(req, res);
});

router.get("/:id", (req, res) => {
  getSingleGeneric(req, res);
});

router.post("/", validateRequest(genericSchema), (req, res) => {
  createGeneric(req, res);
});

router.patch("/:id", (req, res) => {
  updateGeneric(req, res);
});

router.delete("/:id", (req, res) => {
  deleteGeneric(req, res);
});

//
export default router;
