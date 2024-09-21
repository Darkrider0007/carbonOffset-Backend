import { farmonboardingFormSubmitMail } from "../helpers/sendMail.js";
import FarmOnboarding from "../models/farmOnboarding.model.js";

// Create a new farm onboarding entry with detailed missing field validation
export const createFarmOnboarding = async (req, res) => {
  try {
    const requiredFields = [
      "email",
      "name",
      "phone",
      "address",
      "area",
      "coordinates",
      "vegetationType",
      "document",
    ];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    const {
      email,
      name,
      phone,
      organization,
      address,
      area,
      coordinates,
      vegetationType,
      document,
    } = req.body;

    const newFarmOnboarding = await FarmOnboarding.create({
      email,
      name,
      phone,
      organization,
      address,
      area,
      coordinates,
      vegetationType,
      document,
    });

    if (!newFarmOnboarding) {
      return res.status(400).json({ message: "Farm onboarding not created" });
    }

    await farmonboardingFormSubmitMail(email);

    res.status(201).json({
      message: "Farm onboarding created successfully",
      data: newFarmOnboarding,
      status: 201,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllFarmOnboarding = async (req, res) => {
  try {
    const farmOnboarding = await FarmOnboarding.find();
    res.status(200).json(farmOnboarding);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateFarmOnboardingStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const farmOnboarding = await FarmOnboarding.findById(id);

    if (!farmOnboarding) {
      return res.status(404).json({ message: "Farm onboarding not found" });
    }

    farmOnboarding.approvedByAdmin = status;

    await farmOnboarding.save();

    res.status(200).json({ message: "Farm onboarding updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteFarmOnboarding = async (req, res) => {
  try {
    const { id } = req.params;

    const farmOnboarding = await FarmOnboarding.findByIdAndDelete(id);

    if (!farmOnboarding) {
      return res.status(404).json({ message: "Farm onboarding not found" });
    }

    res.status(200).json({ message: "Farm onboarding deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
