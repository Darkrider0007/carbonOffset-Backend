import { newsletterSubscribeMail } from "../helpers/sendMail.js";
import Newsletter from "../models/newslatter.model.js";
import moment from "moment";
export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "Email is required",
      });
    }

    const newsletter = await Newsletter.findOne({ email });

    if (newsletter) {
      return res.status(200).json({
        status: 200,
        message: "Email already subscribed",
      });
    }

    const newNewsletter = await Newsletter.create({ email });

    if (!newNewsletter) {
      return res.status(400).json({
        status: 400,
        message: "Failed to subscribe",
      });
    }

    await newsletterSubscribeMail(email);

    return res.status(200).json({
      status: 200,
      message: "Subscribed successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "Email is required",
      });
    }

    const newsletter = await Newsletter.findOne({ email });

    if (!newsletter) {
      return res.status(400).json({
        status: 400,
        message: "Email not found",
      });
    }

    newsletter.isSubscribed = false;

    await newsletter.save();

    return res.status(200).json({
      status: 200,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({});

    if (!subscribers) {
      return res.status(404).json({
        status: 404,
        message: "No subscribers found",
      });
    }

    subscribers.filter((subscriber) => {
      if (subscriber.isSubscribed) {
        return subscriber;
      }
    });

    const subscriberCount = subscribers.length;

    return res.status(200).json({
      status: 200,
      data: subscribers,
      subscriberCount,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

export const getAllSubscribers = async (req, res) => {
  try {
    // Get the current date and the start of the current and previous months
    const currentDate = moment();
    const startOfCurrentMonth = currentDate.startOf("month").toDate();
    const startOfPreviousMonth = moment(currentDate)
      .subtract(1, "month")
      .startOf("month")
      .toDate();
    const endOfPreviousMonth = moment(currentDate)
      .subtract(1, "month")
      .endOf("month")
      .toDate();

    // Query for current month's subscribers
    const currentMonthSubscribers = await Newsletter.find({
      createdAt: { $gte: startOfCurrentMonth },
    });

    // Query for previous month's subscribers
    const previousMonthSubscribers = await Newsletter.find({
      createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth },
    });

    const totalSubscribers = await Newsletter.find({});

    // Calculate the percentage increase
    const currentCount = currentMonthSubscribers.length;
    const previousCount = previousMonthSubscribers.length;

    let percentageIncrease = 0;

    if (previousCount === 0 && currentCount > 0) {
      percentageIncrease = 100;
    } else if (previousCount > 0) {
      percentageIncrease =
        ((currentCount - previousCount) / previousCount) * 100;
    }

    // Send the response with existing format plus the additional data
    return res.status(200).json({
      status: 200,
      data: totalSubscribers,
      count: totalSubscribers.length,
      currentMonthSubscribers: currentCount,
      previousMonthSubscribers: previousCount,
      percentageIncrease: Math.round(percentageIncrease),
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
