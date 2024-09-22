import dotenv from "dotenv";
import Stripe from "stripe";
import Token from "../models/token.model.js";
import User from "../models/user.model.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: "2020-08-27",
});

export const createCheckoutSession = async (req, res) => {
  try {
    const { totalCost, totalCO2 } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Carbon Offset Payment",
              description: `Offset for ${totalCO2} CO2`,
            },
            unit_amount: Math.round(totalCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};

export const createCheckoutSessionForTokenPurchase = async (req, res) => {
  try {
    const { totalCost, totalCredit } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Carbon Offset Payment",
              description: `Offset for ${totalCredit} credits`,
            },
            unit_amount: Math.round(totalCost * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/`,
    });

    const token = await Token.find();

    const tokenId = token[0]._id;

    const buyToken = await Token.findById(tokenId);

    buyToken.tokenVolume += totalCredit;

    buyToken.tokenVolumeHistory.push({
      tokenPrice: totalCost,
      tokenVolume: totalCredit,
    });

    buyToken.markModified("tokenVolumeHistory");

    const saveTheToken = await buyToken.save();

    if (!saveTheToken) {
      return res.status(500).json({
        status: 500,
        message: "Failed to update token volume",
      });
    }

    const user = req.user;

    const userProfile = await User.findById(user._id);

    userProfile.token = tokenId;

    userProfile.tokenCount += totalCredit;

    userProfile.tokenHistory.push({
      amaount: totalCost,
      description: "Token purchase",
    });

    const saveTheUser = await userProfile.save();

    if (!saveTheUser) {
      return res.status(500).json({
        status: 500,
        message: "Failed to update user token count",
      });
    }

    res.status(200).json({
      id: session.id,
      status: 200,
      message: "Checkout session created successfully",
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
};
