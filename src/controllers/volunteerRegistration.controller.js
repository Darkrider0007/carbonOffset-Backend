import VolunteerRegistration from "../models/volunteerRegistration.model.js";

export const createRegistration = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      city,
      stateOrRegion,
      country,
      ageGroup,
      volunteerRole,
      otherRole,
      preferredInitiative,
      privacyPolicy,
      additionalInfo,
    } = req.body;

    const missingFields = [];

    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!city) missingFields.push("city");
    if (!stateOrRegion) missingFields.push("stateOrRegion");
    if (!country) missingFields.push("country");
    if (!ageGroup) missingFields.push("ageGroup");
    if (!volunteerRole) missingFields.push("volunteerRole");
    if (!privacyPolicy) missingFields.push("privacyPolicy");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const newRegistration = await VolunteerRegistration.create({
      fullName,
      email,
      phone,
      city,
      stateOrRegion,
      country,
      ageGroup,
      volunteerRole,
      otherRole,
      preferredInitiative,
      privacyPolicy,
      additionalInfo,
    });

    res.status(201).json(newRegistration);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// {
//     "fullName": "Stacy Barton",
//     "email": "kyjom@mailinator.com",
//     "phone": "+1 (801) 164-7087",
//     "city": "Nihil ut ipsum lauda",
//     "stateOrRegion": "Quae labore dolorem ",
//     "country": "Indonesia",
//     "ageGroup": "36-50",
//     "volunteerRole": "Other",
//     "preferredInitiative": "Clean Kailash",
//     "privacyPolicy": true,
//     "additionalInfo": "Ex aliquid nobis min",
//     "otherRole": "Voluptatem inventore"
// }
