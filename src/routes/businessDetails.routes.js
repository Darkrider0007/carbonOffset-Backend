import { Router } from "express";
import {
  createBusinessDetails,
  updateCrdits,
} from "../controllers/businessDetails.controller.js";
import { verifyJWT } from "../middleware/verifyUser.js";

const router = Router();

router.post("/", verifyJWT, createBusinessDetails);

router.put("/", verifyJWT, updateCrdits);

export default router;
