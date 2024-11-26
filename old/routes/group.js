import express from "express";
const router = express.Router();
//------------------------------------------------     model & controller
import {
  getGroups,
  getAllGroups,
  saveGroup,
  deleteGroup,
  updateGroup,
} from "../controllers/group.js";
//
router.get("/", (req, res) => {
  console.log("got hit ");
  getAllGroups(req, res);
}); 

router.post("/", (req, res) => saveGroup(req, res));

router.patch("/", (req, res) => updateGroup(req, res));

router.delete("/:id", (req, res) => deleteGroup(req, res));

export default router;
