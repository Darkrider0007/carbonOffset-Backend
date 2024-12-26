import CollaborativeParticipation from "../models/collaborativeParticipation.model.js";

export const createCollaborativeParticipation = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      city,
      stateOrRegion,
      country,
      membershipType,
      collaborationType,
      collaborationFocus,
      additionalInfo,
      agreePrivacy,
    } = req.body;

    const missingFields = [];

    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!city) missingFields.push("city");
    if (!stateOrRegion) missingFields.push("stateOrRegion");
    if (!country) missingFields.push("country");
    if (!membershipType) missingFields.push("membershipType");
    if (!collaborationType) missingFields.push("collaborationType");
    if (!collaborationFocus) missingFields.push("collaborationFocus");
    if (!agreePrivacy) missingFields.push("agreePrivacy");

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({ message: `${missingFields.join(", ")} fields are required` });
    }

    const newCollaborativeParticipation =
      await CollaborativeParticipation.create({
        fullName,
        email,
        phone,
        city,
        stateOrRegion,
        country,
        membershipType,
        collaborationType,
        collaborationFocus,
        additionalInfo,
        agreePrivacy,
      });

    res.status(201).json({
      message: "Collaborative Participation created successfully",
      newCollaborativeParticipation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// {
//     "fullName": "Carroll Preston Traders",
//     "email": "pymy@mailinator.com",
//     "phone": "+1 (777) 228-4334",
//     "city": "Natus quidem aperiam",
//     "stateOrRegion": "Enim voluptate volup",
//     "country": "Zimbabwe",
//     "membershipType": "Collaboration",
//     "collaborationType": "Individual",
//     "collaborationFocus": "Investor",
//     "additionalInfo": "Excepturi veritatis ",
//     "agreePrivacy": true
// }
