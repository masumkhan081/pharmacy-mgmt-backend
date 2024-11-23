import express from "express";
const router = express.Router();
import {
  getSalaries,
  saveSalary,
  updateSalary,
  deleteSalary,
} from "../controllers/salary.js"; // controller functions

router.get("/", (req, res) => {
  getSalaries(req, res);
});

router.post("/", (req, res) => {
  saveSalary(req, res);
});

router.patch("/", (req, res) => {
  updateSalary(req, res);
});
router.delete("/:id", (req, res) => {
  deleteSalary(req, res);
});
//
export default router;
