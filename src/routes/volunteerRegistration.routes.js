import { Router } from "express";
import {
  createRegistration,
  getRegistrations,
} from "../controllers/volunteerRegistration.controller.js";

const router = Router();

router.post("/", createRegistration);

router.get("/", getRegistrations);

export default router;
