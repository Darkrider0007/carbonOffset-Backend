import BusinessDetails from "../models/businessDetails.model.js";

export const createBusinessDetails = async (req, res) => {
  try {
    const {
      name,
      title,
      company,
      industry,
      employees,
      email,
      phone,
      country,
      address,
      city,
      postalCode,
    } = req.body;

    const missingFields = [];

    if (!name) missingFields.push("name");
    if (!title) missingFields.push("title");
    if (!company) missingFields.push("company");
    if (!industry) missingFields.push("industry");
    if (!employees) missingFields.push("employees");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!country) missingFields.push("country");
    if (!address) missingFields.push("address");
    if (!city) missingFields.push("city");
    if (!postalCode) missingFields.push("postalCode");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `The following fields are missing: ${missingFields.join(", ")}`,
      });
    }

    const businessDetails = await BusinessDetails.create({
      name,
      title,
      company,
      industry,
      employees,
      email,
      phone,
      country,
      address,
      city,
      postalCode,
      userId: req.user._id,
    });

    if (!businessDetails) {
      return res
        .status(500)
        .json({ error: "Failed to create business details" });
    }
    res.status(201).json({
      status: 201,
      message: "Business details created successfully",
      data: businessDetails,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create business details" });
  }
};

export const updateCrdits = async (req, res) => {
  try {
    const { businessId, totalCarbonEmmision, totalCarbonOffset, totalCradit } =
      req.body;

    if (!businessId) {
      return res.status(400).json({ error: "Business ID is required" });
    }

    const businessDetails = await BusinessDetails.findById(businessId);

    if (!businessDetails) {
      return res.status(404).json({ error: "Business details not found" });
    }

    if (totalCarbonEmmision) {
      businessDetails.totalCarbonEmmision = totalCarbonEmmision;
    }

    if (totalCarbonOffset) {
      businessDetails.totalCarbonOffset = totalCarbonOffset;
    }

    if (totalCradit) {
      businessDetails.totalCradit = totalCradit;
    }

    const updatedBusinessDetails = await businessDetails.save();

    if (!updatedBusinessDetails) {
      return res.status(500).json({ error: "Failed to update credits" });
    }

    res.status(200).json({
      status: 200,
      message: "Credits updated successfully",
      data: updatedBusinessDetails,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update credits" });
  }
};

export const getBusinessDetails = async (req, res) => {
  try {
    const businessDetails = await BusinessDetails.find();

    if (!businessDetails) {
      return res.status(404).json({ error: "Business details not found" });
    }

    if (businessDetails.length === 0) {
      return res.status(404).json({ error: "Business details not found" });
    }

    res.status(200).json({
      status: 200,
      message: "Business details retrieved successfully",
      data: businessDetails,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get business details" });
  }
};

// {
//     "name": "Zenaida Montgomery",
//     "title": "Ullamco eveniet pro",
//     "company": "Leblanc and Rivas Trading",
//     "industry": "services",
//     "employees": 30,
//     "email": "xade@mailinator.com",
//     "phone": "+1 (235) 298-9767",
//     "country": "Ullam ullamco mollit",
//     "address": "Et omnis pariatur E",
//     "city": "Voluptate quia aut n",
//     "postalCode": "Et exercitation enim"
// }
