import express from "express";
const router = express.Router();
import {
  getSales,
  saveSale,
  updateSale,
  deleteSale,
} from "../controllers/sale.js";
//
router.get("/", (req, res) => {
  getSales(req, res);
});
router.post("/", (req, res) => {
  saveSale(req, res);
});
router.patch("/", (req, res) => {
  updateSale(req, res);
});
router.delete("/:id", (req, res) => {
  deleteSale(req, res);
});

router.get("/search", (req, res) => {
  const name = req.query.frmname;
  getSales(req, res, { name: name });
});

export default router;
