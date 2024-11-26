import {
  saveDrug,
  getStock,
  deleteDrug,
  updateDrug,
} from "../controllers/drugs.js";
import express from "express";
const router = express.Router();
//

router.get("/", (req, res) => {
  getStock(req, res);
});
router.post("/", (req, res) => {
  saveDrug(req, res);
});
router.patch("/", (req, res) => {
  updateDrug(req, res);
});
router.delete("/:id", (req, res) => {
  deleteDrug(req, res);
});

export default router;
