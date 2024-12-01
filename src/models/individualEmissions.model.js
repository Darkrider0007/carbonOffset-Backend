import mongoose from "mongoose";

const individualEmissionsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    vehicleData: {
        type: Array,
        default: [],
    },
    naturalgas: {
        type: Number,
    },
    electricity: {
        type: Number,
    },
    fueloil: {
        type: Number,
    },
    waste: {
        type: Number,
    },
    calculatedValue: {
        type: Number,
    },
}, {
    timestamps: true,
});

export default mongoose.model("IndividualEmissions", individualEmissionsSchema);
