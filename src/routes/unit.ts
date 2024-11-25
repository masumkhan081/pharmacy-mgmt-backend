import express from "express";
const router = express.Router();
import {
  getUnits,
  
} from "../controllers/unit.js"; // controller functions

router.get("/", (req, res) => {
  getUnits(req, res);
});

// router.post("/", (req, res) => {
//   saveUnit(req, res);
// });

// router.patch("/", (req, res) => {
//   updateUnit(req, res);
// });

// router.delete("/:id", (req, res) => {
//   deleteUnit(req, res);
// });

//
export default router;
