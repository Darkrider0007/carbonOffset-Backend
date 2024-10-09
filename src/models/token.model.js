import mongoose from "mongoose";

const tokenPriceHistorySchema = new mongoose.Schema(
  {
    tokenPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const tokenVolumeHistorySchema = new mongoose.Schema(
  {
    tokenPrice: {
      type: Number,
    },
    tokenVolume: {
      type: Number,
      required: true,
    },
    purchasedBy: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const tokenSchema = new mongoose.Schema(
  {
    tokenPrice: {
      type: Number,
      required: true,
    },
    tokenVolume: {
      type: Number,
      required: true,
    },
    tokenPerTon: {
      type: Number,
      default: 0,
    },
    tokenPriceHistory: {
      type: [tokenPriceHistorySchema],
    },
    tokenVolumeHistory: {
      type: [tokenVolumeHistorySchema],
      default: [],
    },
    tokenLimit: {
      type: Number,
      default: 1000,
    },
  },
  {
    timestamps: true,
  }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;
