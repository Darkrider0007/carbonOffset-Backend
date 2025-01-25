import mongoose from "mongoose";

const businessDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    employees: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    totalCarbonEmmision: {
      type: Number,
      default: 0,
    },
    totalCarbonOffset: {
      type: Number,
      default: 0,
    },
    totalCradit: {
      type: Number,
      default: 0,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const BusinessDetails = mongoose.model(
  "BusinessDetails",
  businessDetailsSchema
);

export default BusinessDetails;

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
