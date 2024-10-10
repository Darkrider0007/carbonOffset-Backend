import { Router } from "express";
import {
  createCheckoutSession,
  createCheckoutSessionForTokenPurchase,
  getAllCheckOutSeason,
  listAllCheckoutSessions,
  totalAmountReceived,
} from "../controllers/createCheckoutSession.controllers.js";
import { verifyJWT } from "../middleware/verifyUser.js";

const router = Router();

router.post("/", createCheckoutSession);
router.post(
  "/token-purchase",
  verifyJWT,
  createCheckoutSessionForTokenPurchase
);
router.get("/totalAmountReceived", totalAmountReceived);
router.get("/listTransactions", listAllCheckoutSessions);

export default router;
