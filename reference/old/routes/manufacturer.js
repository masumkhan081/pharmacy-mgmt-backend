import express from "express";
const router = express.Router();
import {
  getAllMFR,
  getMFR,
  saveMFR,
  deleteMFR,
  updateMFR,
} from "../controllers/manufacturer.js"; // controller functions

router.get("/", (req, res) => {
  getMFR(req, res);
});

router.get("/all", (req, res) => {
  getAllMFR(req, res);
});

router.post("/", (req, res) => {
  saveMFR(req, res);
});

router.patch("/", (req, res) => {
  updateMFR(req, res);
});

router.delete("/:id", (req, res) => {
  deleteMFR(req, res);
});

//
export default router;
