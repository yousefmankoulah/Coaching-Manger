import { User, Plan, Subscribe } from "../models/userModel.js";
import Stripe from "stripe";
import { errorHandler } from "../utils/error.js";
import { Buffer } from "buffer";

const stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY, {
  appInfo: {
    name: "OnlineCoaching",
  },
});

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

// Main function to create or update a subscription
// export const createSubscription = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.userId);
//     if (!user) {
//       return next(new Error("User not found."));
//     }

//     const planId = req.params._id;
//     const plan = await Plan.findById(planId);

//     if (!plan) {
//       return res.status(404).json({ error: "Plan not found" });
//     }

//     let existingSubscription = await Subscribe.findOne({
//       user: req.params.userId,
//     });
//     const today = new Date();

//     if (typeof plan.validityDays !== "number") {
//       return res
//         .status(400)
//         .json({ error: "Invalid validation days in the plan" });
//     }

//     const endDate = new Date(
//       today.getTime() + plan.validityDays * 24 * 60 * 60 * 1000
//     );
//     if (isNaN(endDate.getTime())) {
//       return res
//         .status(500)
//         .json({ error: "Failed to calculate the end date" });
//     }

//     if (existingSubscription) {
//       if (
//         existingSubscription.isActive &&
//         today < existingSubscription.endDate
//       ) {
//         return res
//           .status(400)
//           .json({ error: "Active subscription already exists." });
//       }

//       existingSubscription.plan = planId;
//       existingSubscription.startDate = today;
//       existingSubscription.endDate = endDate;
//       existingSubscription.isActive = true;
//       await existingSubscription.save();
//     } else {
//       existingSubscription = new Subscribe({
//         user: req.params.userId,
//         plan: planId,
//         startDate: today,
//         endDate: endDate,
//         isActive: today < endDate,
//       });
//       await existingSubscription.save();
//     }

//     user.plan = planId;
//     await user.save();

//     return res
//       .status(existingSubscription ? 200 : 201)
//       .json(existingSubscription);
//   } catch (error) {
//     console.error("Internal server error:", error);
//     next(new Error("Internal server error"));
//   }
// };



export const createSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new Error("User not found."));
    }

    const planId = req.params._id;
    const plan = await Plan.findById(planId);

    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    let existingSubscription = await Subscribe.findOne({
      user: req.params.userId,
    });
    const today = new Date();

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
    } else {
      existingSubscription = new Subscribe({
        user: req.params.userId,
        plan: planId,
        startDate: today,
        endDate: endDate,
        isActive: today < endDate,
      });
      await existingSubscription.save();
    }

    user.plan = planId;
    await user.save();

    return res
      .status(existingSubscription ? 200 : 201)
      .json(existingSubscription);
  } catch (error) {
    console.error("Internal server error:", error);
    next(new Error("Internal server error"));
  }
};

// const endpointSecret = "whsec_8mIpfMdkrgqhsw911cnPJflNJE9HE0pB";
const endpointSecret = "whsec_Jb08oKNtcuk73dSo3VjeR2AnP0z52vcB";

export const webhook = async (req, res) => {
  const customers = await stripeInstance.customers.list(
    {
      email: "yousef.mankola10@gmail.com",
      limit: 1,
    },
    {
      apiKey: process.env.STRIPE_SECRET_KEY,
    }
  );

  if (customers.data.length === 0) {
    console.log("No customer found with that email.");
    return [];
  }

  // Get customer ID
  const customerId = customers.data[0].id;

  // Retrieve subscriptions for the customer ID
  const subscriptions = await stripeInstance.subscriptions.list(
    { customer: customerId },
    { apiKey: process.env.STRIPE_SECRET_KEY }
  );

  // Map over subscriptions and log details
  subscriptions.data.map((subscription) => {
    const details = {
      id: subscription.id,
      status: subscription.status,
      startDate: new Date(
        subscription.current_period_start * 1000
      ).toLocaleDateString("en-US"),
      endDate: new Date(
        subscription.current_period_end * 1000
      ).toLocaleDateString("en-US"),
      price: {
        amount: subscription.plan.amount / 100, // Converting cents to dollars
        currency: subscription.plan.currency.toUpperCase(),
        interval: subscription.plan.interval,
      },
      productName: subscription.plan.product, // This is the product ID
    };
    console.log(details);
  });
};
