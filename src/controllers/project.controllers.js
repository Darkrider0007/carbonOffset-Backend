import projectModel from "../models/project.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new project
export const createProject = async (req, res) => {
  // console.log(req);
  // console.log(req.file.path);
  try {
    const imageLocalPath = req.file.path;

    const userImg = await uploadOnCloudinary(imageLocalPath);

    const { name, location, userCount, details } = req.body;

    if ([name, location, details].includes(undefined)) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const project = await projectModel.create({
      name,
      location,
      userCount,
      details,
      image: userImg.url,
    });

    if (!project) {
      return res.status(400).json({ message: "Project not created" });
    }

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// Get project by ID

export const getProjectById = async (req, res) => {
  try {
    const project = await projectModel.findById(req.params.id);
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Get all projects

export const getAllProjects = async (req, res) => {
  try {
    const projects = await projectModel.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await projectModel.findByIdAndDelete(req.params.id);
    res.status(200).json(project);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
