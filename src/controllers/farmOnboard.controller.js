import {
  farmonboardingAccpectMail,
  farmonboardingFormSubmitMail,
  farmonboardingRejectMail,
  newFarmOnboardingNotfication,
} from "../helpers/sendMail.js";
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
    await newFarmOnboardingNotfication(
      process.env.ADMIN_EMAIL1,
      name,
      organization,
      address,
      area,
      "https://carbon-offset-tau.vercel.app/admin/adminRoute"
    );
    // await newFarmOnboardingNotfication(process.env.ADMIN_EMAIL2);
    // await newFarmOnboardingNotfication(process.env.ADMIN_EMAIL3);

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

    if (typeof status !== "boolean") {
      return res
        .status(400)
        .json({ message: "Status must be a boolean value." });
    }

    const farmOnboarding = await FarmOnboarding.findById(id);

    if (!farmOnboarding) {
      return res.status(404).json({ message: "Farm onboarding not found." });
    }

    farmOnboarding.approvedByAdmin = status;
    farmOnboarding.isRejected = !status;

    farmOnboarding.markModified("approvedByAdmin");
    farmOnboarding.markModified("isRejected");
    await farmOnboarding.save();

    if (status) await farmonboardingAccpectMail(farmOnboarding.email);
    else await farmonboardingRejectMail(farmOnboarding.email);

    const message = status
      ? "Farm onboarding approved successfully."
      : "Farm onboarding rejected successfully.";

    res.status(200).json({ message });
  } catch (error) {
    console.error("Error updating farm onboarding status:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later." });
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
