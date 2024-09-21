import { Router } from "express";
import {
  createFarmOnboarding,
  deleteFarmOnboarding,
  getAllFarmOnboarding,
  updateFarmOnboardingStatus,
} from "../controllers/farmOnboard.controller.js";

const router = Router();

router.post("/create-farm-onboarding", createFarmOnboarding);
router.get("/get-all-farm-onboarding", getAllFarmOnboarding);
router.put("/update-farm-onboarding-status", updateFarmOnboardingStatus);
router.delete("/delete-farm-onboarding/:id", deleteFarmOnboarding);

export default router;
