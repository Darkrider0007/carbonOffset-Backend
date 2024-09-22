import { Router } from "express";
import { adminLogin, verifyAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.post("/admin-login", adminLogin);
router.get("/verify-admin", verifyAdmin);

export default router;
