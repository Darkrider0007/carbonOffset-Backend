import { Router } from "express";
import {
  createCollaborativeParticipation,
  getCollaborativeParticipation,
} from "../controllers/collaborativeParticipation.controller.js";

const router = Router();

router.post("/", createCollaborativeParticipation);

router.get("/", getCollaborativeParticipation);

export default router;
