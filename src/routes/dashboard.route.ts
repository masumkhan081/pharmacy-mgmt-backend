import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller";
import requireAuth from "../middlewares/requireAuth";

const router = Router();

router.get("/stats", requireAuth, dashboardController.getStats);

export default router;
