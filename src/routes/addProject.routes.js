import { Router } from "express";
import {
  createProject,
  deleteProject,
  editProject,
  getAllProjects,
  getProjectById,
} from "../controllers/project.controller.js";
import { upload } from "../middleware/multer.js";

const router = Router();

router.get("/:id", getProjectById);

router.get("/", getAllProjects);

router.post("/", upload.single("image"), createProject);

router.put("/:id", upload.single("image"), editProject);

router.delete("/:id", deleteProject);

export default router;
