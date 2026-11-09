import { Router } from "express";
import { getAreas, createArea, updateArea, deleteArea } from "../controllers/areaController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.get("/", getAreas);
router.post("/", protect, authorize("admin"), createArea);
router.put("/:id", protect, authorize("admin"), updateArea);
router.delete("/:id", protect, authorize("admin"), deleteArea);
export default router;
