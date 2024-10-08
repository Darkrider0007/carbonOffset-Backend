import { Router } from "express";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
} from "../controllers/project.controllers.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.get("/:id", getProjectById);

router.get("/", getAllProjects);

router.post("/", upload.single("image"), createProject);

router.delete("/:id", deleteProject);

export default router;
