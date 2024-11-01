  import { proposalSubmitMail, proposalSubmittedMailToAdmin } from "../helpers/sendMail.js";
import Proposal from "../models/proposoal.model.js";
  
  // Create a new farm onboarding entry with detailed missing field validation
  export const createProposal = async (req, res) => {
    try {
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "proposalDetails",   
      ];
      const missingFields = [];
  
      requiredFields.forEach((field) => {
        if (!req.body[field]) {
          missingFields.push(field);
        }
      });
  
      if (missingFields.length > 0) {
        return res.status(400).json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
      const {
        firstName,
        lastName,
        email,
        proposalDetails,
        isNeedFund,
      } = req.body;

      const isAlreadyExist = await Proposal.findOne({ email });

        if (isAlreadyExist) {
            return res.status(400).json({ message: "Proposal already exist" });
        }
  
      const newProposal = await Proposal.create({
        firstName,
        lastName,
        email,
        proposalDetails,
        isNeedFund,
      });
  
      if (!newProposal) {
        return res.status(400).json({ message: "Proposal not created" });
      }

      await proposalSubmitMail(email, `${firstName} ${lastName}`, "https://1world1nation.org/");
      await proposalSubmittedMailToAdmin({
        firstName,
        lastName,
        email,
        proposalDetails,
        isNeedFund
      })
  
      res.status(201).json({
        message: "Proposal created successfully",
        data: newProposal,
        status: 201,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

  // Get all farm onboarding entries

  export const getProposals = async (req, res) => {
    try {
      const proposals = await Proposal.find();
  
      if (!proposals) {
        return res.status(400).json({ message: "No proposals found" });
      }
  
      res.status(200).json({
        message: "Proposals retrieved successfully",
        data: proposals,
        status: 200,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  