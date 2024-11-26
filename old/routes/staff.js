import express from "express";
const router = express.Router();
import {
  getStaff,
  saveStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staff.js"; // controller functions

router.get("/", (req, res) => {
  getStaff(req, res);
});

router.post("/", (req, res) => {
  saveStaff(req, res);
});

router.patch("/", (req, res) => {
  updateStaff(req, res);
});
router.delete("/:id", (req, res) => {
  deleteStaff(req, res);
});
//
export default router;
