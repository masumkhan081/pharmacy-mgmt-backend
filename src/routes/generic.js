import express from "express";
const router = express.Router();
import {
  getGenericByGroup,
  getGenerics,
  saveGeneric,
  deleteGeneric,
  updateGeneric,
} from "../controllers/generic.js";
//

router.get("/", (req, res) => { 
  getGenerics(req, res);
});

router.get("/:id", (req, res) => {
  getGenericByGroup(req, res);
});

router.post("/", (req, res) => saveGeneric(req, res));

router.patch("/", (req, res) => updateGeneric(req, res));

router.delete("/:id", (req, res) => deleteGeneric(req, res));

export default router;
