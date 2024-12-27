import mongoose from "mongoose";

const collaborativeParticipationSchema = new mongoose.Schema(
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
    membershipType: {
      type: String,
      required: true,
    },
    collaborationType: {
      type: String,
      required: true,
    },
    collaborationFocus: {
      type: String,
      required: true,
    },
    agreePrivacy: {
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

const CollaborativeParticipation = mongoose.model(
  "CollaborativeParticipation",
  collaborativeParticipationSchema
);

export default CollaborativeParticipation;

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