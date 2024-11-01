import { Router } from "express";
import { createProposal, getProposals } from "../controllers/proposal.controller.js";


const router = Router();

router.post("/create", createProposal)

router.get("/", getProposals);



export default router;
