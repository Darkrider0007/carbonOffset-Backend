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
    proposalDetails:{
        type: String,
        required: true,
    },
    isNeedFund:{
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
