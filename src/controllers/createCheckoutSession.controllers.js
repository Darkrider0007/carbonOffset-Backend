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
      purchasedBy: req.user._id,
      netChange: totalCredit,
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

export const getAllCheckOutSeason = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const sessions = await stripe.checkout.sessions.list({
      limit,
    });

    res.json(sessions);
  } catch (error) {
    console.error("Error listing checkout sessions:", error);
    res.status(500).json({ error: "Failed to list checkout sessions" });
  }
};

export const listAllCheckoutSessions = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const sessions = await stripe.checkout.sessions.list({
      limit,
    });

    if (!sessions.data || sessions.data.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No checkout session found",
      });
    }

    const sessionDetails = sessions.data
      .filter((session) => session.payment_status === "paid")
      .sort((a, b) => b.created - a.created)
      .map((session) => {
        const paymentTime = new Date(session.created * 1000).toLocaleString(
          "en-US",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "long",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }
        );

        return {
          name: session.customer_details?.name || "Not provided",
          email: session.customer_details?.email || "Not provided",
          id: session.id,
          paymentId: session.payment_intent || "Not provided",
          totalAmount: session.amount_total || 0,
          currency: session.currency || "Not specified",
          paymentTime,
        };
      });

    return res.status(200).json({
      status: 200,
      message: "Checkout sessions retrieved successfully",
      totalData: sessions.data.length,
      data: sessionDetails,
    });
  } catch (error) {
    console.error("Error listing checkout sessions:", error);
    res.status(500).json({ error: "Failed to list checkout sessions" });
  }
};

export const totalAmountReceived = async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const sessions = await stripe.checkout.sessions.list({
      limit,
    });

    const totalBalance = await stripe.balance.retrieve();

    if (!sessions.data || sessions.data.length === 0) {
      return res.status(404).json({
        status: 404,
        message: "No checkout session found",
      });
    }

    const totalAmount = sessions.data.reduce(
      (acc, session) => acc + session.amount_total,
      0
    );

    res.status(200).json({
      status: 200,
      message: "Total amount received retrieved successfully",
      totalAmount,
      totalBalance,
    });
  } catch (error) {}
};
