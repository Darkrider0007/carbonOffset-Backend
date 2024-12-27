import { Router } from "express";
import {
  createCollaborativeParticipation,
  getCollaborativeParticipation,
} from "../controllers/collaborativeParticipation.controller.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";

const router = Router();

router.post("/", createCollaborativeParticipation);

router.get("/", getCollaborativeParticipation);

export default router;
