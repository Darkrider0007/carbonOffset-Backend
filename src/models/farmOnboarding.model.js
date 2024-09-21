import mongoose from "mongoose";

const { Schema, model } = mongoose;

const FarmOnboardingSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    coordinates: {
      type: String,
      trim: true,
    },
    vegetationType: {
      type: String,
      trim: true,
    },
    document: {
      type: String,
      required: true,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const FarmOnboarding = model("FarmOnboarding", FarmOnboardingSchema);

export default FarmOnboarding;
