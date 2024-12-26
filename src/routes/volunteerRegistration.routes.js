import { Router } from "express";
import { createRegistration } from "../controllers/volunteerRegistration.controller.js";

const router = Router();

router.post("/", createRegistration);

export default router;
