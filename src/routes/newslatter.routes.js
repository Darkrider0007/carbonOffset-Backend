import { Router } from "express";
import {
  getAllSubscribers,
  getSubscribers,
  subscribe,
  unsubscribe,
} from "../controllers/newslatter.controller.js";

const router = Router();

router.post("/subscribe", subscribe);

router.post("/unsubscribe", unsubscribe);

router.get("/getAllSubscribersNeedToSendMail", getSubscribers);

router.get("/getAllSubscribers", getAllSubscribers);

export default router;
