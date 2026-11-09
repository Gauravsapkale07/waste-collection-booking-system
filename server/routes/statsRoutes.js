import { Router } from "express";
import { getAdminStats } from "../controllers/statsController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, authorize("admin"), getAdminStats);
export default router;
