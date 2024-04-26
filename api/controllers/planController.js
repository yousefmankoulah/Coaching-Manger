import { User, Plan, Subscribe } from "../models/userModel.js";
import Stripe from "stripe";
import { errorHandler } from "../utils/error.js";

const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);

export const plansMonthly = async (req, res, next) => {
  try {
    const plans = await Plan.find({ validityDays: 30 }).sort({ price: 1 });
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

export const plansYearly = async (req, res, next) => {
  try {
    const plans = await Plan.find({ validityDays: 365 }).sort({ price: 1 });
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

export const getAPlan = async (req, res, next) => {
  try {
    const plans = await Plan.findById(req.params._id);
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

export const getTheSubscriptions = async (req, res, next) => {
  try {
    const plans = await Subscribe.find({ user: req.params._id });
    res.json(plans);
  } catch (err) {
    next(err);
  }
};

/*********** create subscription ************/

export const createSubscription = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(errorHandler(401, "Please sign in."));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(errorHandler(404, "User not found."));
    }

    let existingSubscription = await Subscribe.findOne({ user: req.user.id });
    const today = new Date();
    const planId = req.params._id;
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    if (typeof plan.validityDays !== "number") {
      return res
        .status(400)
        .json({ error: "Invalid validation days in the plan" });
    }

    const endDate = new Date(
      today.getTime() + plan.validityDays * 24 * 60 * 60 * 1000
    );

    if (isNaN(endDate.getTime())) {
      return res
        .status(500)
        .json({ error: "Failed to calculate the end date" });
    }

    if (existingSubscription) {
      if (
        existingSubscription.isActive &&
        today < existingSubscription.endDate
      ) {
        return res
          .status(400)
          .json({ error: "Active subscription already exists." });
      }

      existingSubscription.plan = planId;
      existingSubscription.startDate = today;
      existingSubscription.endDate = endDate;
      existingSubscription.isActive = true;
      await existingSubscription.save();

      return res.status(200).json(existingSubscription);
    } else {
      const newSubscription = new Subscribe({
        user: req.user.id,
        plan: planId,
        startDate: today,
        endDate: endDate,
        isActive: today < endDate,
      });

      await newSubscription.save();
      return res.status(201).json(newSubscription);
    }
  } catch (error) {
    console.error("Internal server error:", error);
    next(errorHandler(500, "Internal server error"));
  }
};
