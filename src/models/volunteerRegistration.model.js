import mongoose from "mongoose";

const volunteerRegistrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
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
    city: {
      type: String,
      required: true,
    },
    stateOrRegion: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    ageGroup: {
      type: String,
      required: true,
    },

    volunteerRole: {
      type: String,
      required: true,
    },
    otherRole: {
      type: String,
    },
    preferredInitiative: {
      type: String,
    },
    privacyPolicy: {
      type: Boolean,
      required: true,
    },
    additionalInfo: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const VolunteerRegistration = mongoose.model(
  "VolunteerRegistration",
  volunteerRegistrationSchema
);

export default VolunteerRegistration;

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
