import { Router } from "express";
import {
  createToken,
  getToken,
  shrinkTokenVolume,
  updateTokenLimit,
  updateTokenPerTon,
  updateTokenValue,
  updateTokenVolume,
} from "../controllers/token.controller.js";

const router = Router();

router.post("/", createToken);

router.get("/", getToken);

router.put("/update-token-value/:tokenId", updateTokenValue);

router.put("/update-token-count/:tokenId", updateTokenVolume);

router.put("/update-token-per-ton/:tokenId", updateTokenPerTon);

router.put("/update-token-limit/:tokenId", updateTokenLimit);

router.delete("/shrink-token-volume/:tokenId", shrinkTokenVolume);

export default router;
