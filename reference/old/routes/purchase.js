import express from "express";
const router = express.Router();
import {
  getPurchases,
  savePurchase,
  deletePurchase,
  updatePurchase,
} from "../controllers/purchase.js";
//
router.get("/", (req, res) => {
  getPurchases(req, res);
});
router.post("/", (req, res) => {
  savePurchase(req, res);
});
router.patch("/", (req, res) => {
  updatePurchase(req, res);
});
router.delete("/:id", (req, res) => {
  deletePurchase(req, res);
});

router.get("/search", (req, res) => {
  const name = req.query.frmname;
  getPurchases(req, res, { name: name });
});
export default router;
