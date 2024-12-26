import { Router } from "express";
import { createMembership } from "../controllers/membership.controller.js";

const router = Router();

router.post("/create", createMembership);

export default router;
