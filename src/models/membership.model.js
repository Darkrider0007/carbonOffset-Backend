import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema({
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
  streetAddress: {
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
  postalCode: {
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
  paymentMethod: {
    type: String,
    required: true,
  },
  autoRenew: {
    type: Boolean,
    required: true,
  },
  idProof: {
    type: String,
    required: false,
  },
  agreePrivacy: {
    type: Boolean,
    required: true,
  },
  digitalSignatureName: {
    type: String,
    required: true,
  },
  organizationName: {
    type: String,
  },
  organizationAddress: {
    type: String,
  },
  organizationPostalCode: {
    type: String,
  },
  corporateRegistration: {
    type: String,
  },
});

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;
// {
//     "fullName": "Florence Clements",
//     "email": "hefexetu@mailinator.com",
//     "phone": "+1 (448) 574-5246",
//     "streetAddress": "Officia ipsam in ten",
//     "city": "Recusandae Quaerat ",
//     "stateOrRegion": "In dolore repudianda",
//     "postalCode": "Voluptate est ut sae",
//     "country": "Poland",
//     "membershipType": "Corporate Membership ($500/year)",
//     "paymentMethod": "Bank Transfer",
//     "autoRenew": "true",
//     "idProof": {
//         "0": {}
//     },
//     "agreePrivacy": true,
//     "digitalSignatureName": "Mia Ortiz",
//     "organizationName": "Clay and Snyder Co",
//     "organizationAddress": "Kelly and Rodriquez Co",
//     "organizationPostalCode": "Sexton and Henderson LLC",
//     "corporateRegistration": {
//         "0": {}
//     }
// }
