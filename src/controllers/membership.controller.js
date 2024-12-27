import {
  createMembershipMail,
  membershipSubmittedToAdmin,
} from "../helpers/sendMail.js";
import Membership from "../models/membership.model.js";

const createMembership = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      streetAddress,
      city,
      stateOrRegion,
      postalCode,
      country,
      membershipType,
      paymentMethod,
      autoRenew,
      idProof,
      agreePrivacy,
      digitalSignatureName,
      organizationName,
      organizationAddress,
      organizationPostalCode,
      corporateRegistration,
    } = req.body;

    const missingFields = [];

    if (!fullName) missingFields.push("fullName");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!streetAddress) missingFields.push("streetAddress");
    if (!city) missingFields.push("city");
    if (!stateOrRegion) missingFields.push("stateOrRegion");
    if (!postalCode) missingFields.push("postalCode");
    if (!country) missingFields.push("country");
    if (!membershipType) missingFields.push("membershipType");
    if (!paymentMethod) missingFields.push("paymentMethod");
    if (!autoRenew) missingFields.push("autoRenew");
    if (!idProof) missingFields.push("idProof");
    if (!agreePrivacy) missingFields.push("agreePrivacy");
    if (!digitalSignatureName) missingFields.push("digitalSignatureName");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const isAlreadyExist = await Membership.findOne({ email });

    if (isAlreadyExist) {
      return res.status(400).json({ message: "Membership already exist" });
    }

    const newMembership = await Membership.create({
      fullName,
      email,
      phone,
      streetAddress,
      city,
      stateOrRegion,
      postalCode,
      country,
      membershipType,
      paymentMethod,
      autoRenew,
      idProof,
      agreePrivacy,
      digitalSignatureName,
      organizationName,
      organizationAddress,
      organizationPostalCode,
      corporateRegistration,
    });

    if (!newMembership) {
      return res.status(400).json({ message: "Membership not created" });
    }

    console.log("Membership created successfully", newMembership);

    await createMembershipMail(email, fullName);

    await membershipSubmittedToAdmin(email, fullName);

    res.status(201).json({ message: "Membership created successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();

    if (!memberships) {
      return res.status(400).json({ message: "No membership found" });
    }

    if (memberships.length === 0) {
      return res.status(400).json({ message: "No membership found" });
    }

    memberships.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({ memberships });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export { createMembership, getMemberships };
