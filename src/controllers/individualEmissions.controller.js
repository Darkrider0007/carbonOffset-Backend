import individualEmissionsModel from "../models/individualEmissions.model.js";

// Constants for calculating emissions

const missionFactors = {
    gasoline: 0.008887,
    naturalgas: 0.0053,
    electricity: 0.000417,
    fueloil: 0.01018,
    waste: 0.314,
}

export const calculateIndividualEmissions = async (req, res) => {
    const { vehicleData, naturalgas, electricity, fueloil, waste } = req.body;
    try {
        let totalEmissions = 0;

        // Calculate emissions from vehicles
        vehicleData.forEach(vehicle => {
            if (vehicle.vehicleType === "gas") {
                totalEmissions += (vehicle.milesPerYear * missionFactors.gasoline * vehicle.months) / (vehicle.fuelEfficiency * 12);
            } else if (vehicle.vehicleType === "electric") {
                totalEmissions += vehicle.milesPerYear * missionFactors.electricity * vehicle.months / (12 * 10);
            }
        });

        // Calculate emissions from natural gas
        totalEmissions += naturalgas * missionFactors.naturalgas * 12;

        // Calculate emissions from electricity
        totalEmissions += electricity * missionFactors.electricity * 12;

        // Calculate emissions from fuel oil
        totalEmissions += fueloil * missionFactors.fueloil * 12;

        // Calculate emissions from waste
        totalEmissions += waste * missionFactors.waste;

        const individualEmissions = await individualEmissionsModel.create({
            userId: req.user._id,
            vehicleData,
            naturalgas,
            electricity,
            fueloil,
            waste,
            calculatedValue: totalEmissions,
        });

        res.status(201).send({ message: "Emissions calculated successfully", totalEmissions });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}