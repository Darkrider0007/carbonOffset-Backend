import { Router } from "express";
import { calculateIndividualEmissions } from "../controllers/individualEmissions.controller.js";
import { verifyJWT } from "../middleware/verifyUser.js";

const router = Router();


router.post("/create-individual-emissions", verifyJWT, calculateIndividualEmissions);

export default router;