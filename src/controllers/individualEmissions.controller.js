import individualEmissionsModel from "../models/individualEmissions.model.js";

// Constants for calculating emissions

const emissionFactors = {
    gasoline: 0.008887,
    naturalgas: 0.0053,
    electricity: 0.000417,
    flight: 0.01018,
    waste: 0.314,
}

export const calculateIndividualEmissions = async (req, res) => {
    const { vehicleData, naturalgas, electricity, flight, waste } = req.body;
    try {
        let totalEmissions = 0;

        // Calculate emissions from vehicles
        vehicleData.forEach(vehicle => {
            if (vehicle.vehicleType === "gas") {
                totalEmissions += (vehicle.milesPerYear * emissionFactors.gasoline * vehicle.months) / (vehicle.fuelEfficiency * 12);
            } else if (vehicle.vehicleType === "electric") {
                totalEmissions += vehicle.milesPerYear * emissionFactors.electricity * vehicle.months / (12 * 10);
            }
        });

        // Calculate emissions from flight
        // totalEmissions += flight * emissionFactors.flight * 12;
        flight.forEach(flight => {
            let RFI = 1.7;
            if (flight.distance <= 932) {
                emissionFactors.flight = 0.15;
                RFI = 1.7;
            } else if (flight.distance > 932 && flight.distance <= 1554) {
                emissionFactors.flight = 0.09;
                RFI = 1.9;
            } else {
                emissionFactors.flight = 0.053;
                RFI = 3;
            }
            totalEmissions += (flight.distance * emissionFactors.flight * RFI) / 1000;
        });

        // Calculate emissions from natural gas
        totalEmissions += naturalgas * emissionFactors.naturalgas * 12;

        // Calculate emissions from electricity
        totalEmissions += electricity * emissionFactors.electricity * 12;



        // Calculate emissions from waste
        totalEmissions += waste * emissionFactors.waste;

        const individualEmissions = await individualEmissionsModel.create({
            userId: req.user._id,
            vehicleData,
            naturalgas,
            electricity,
            flight,
            waste,
            calculatedValue: totalEmissions,
        });

        res.status(201).send({ message: "Emissions calculated successfully", totalEmissions });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}