import { Router } from "express";
import {
  createMembership,
  getMemberships,
} from "../controllers/membership.controller.js";

const router = Router();

router.post("/create", createMembership);

router.get("/", getMemberships);

export default router;
