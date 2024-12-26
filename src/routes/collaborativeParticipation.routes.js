import { Router } from "express";
import { createCollaborativeParticipation } from "../controllers/collaborativeParticipation.controller.js";

const router = Router();

router.post("/", createCollaborativeParticipation);

export default router;
