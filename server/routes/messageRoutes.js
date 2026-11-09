import { Router } from "express";
import { createMessage, getMessages, getMessage, markMessageRead, deleteMessage } from "../controllers/messageController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();
router.post("/", createMessage);
router.get("/", protect, authorize("admin"), getMessages);
router.get("/:id", protect, authorize("admin"), getMessage);
router.patch("/:id/read", protect, authorize("admin"), markMessageRead);
router.delete("/:id", protect, authorize("admin"), deleteMessage);
export default router;
