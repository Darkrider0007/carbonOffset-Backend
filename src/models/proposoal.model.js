import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    proposalTitle: {
      type: String,
      required: true,
    },
    proposalDetails: {
      type: String,
      required: true,
    },
    focusArea: {
      type: String,
      required: true,
    },
    supportingDocuments: {
      type: String,
      required: false,
    },
    agreePrivacy: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;
