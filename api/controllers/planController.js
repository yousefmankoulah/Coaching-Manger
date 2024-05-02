import { User, Plan, Subscribe } from "../models/userModel.js";
import Stripe from "stripe";
import { errorHandler } from "../utils/error.js";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
            },
            unit_amount: plan.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url:
        "https://cautious-journey-5xx4666q445cvjp5-5173.app.github.dev?success=true",
      cancel_url:
        "https://cautious-journey-5xx4666q445cvjp5-5173.app.github.dev?canceled=true",
    });

    res.json({ url: session.url });

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

    // const session = await stripe.checkout.sessions.create({
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "usd", // Specify the currency
    //         product_data: {
    //           name: plan.name, // Optionally include the product name
    //         },
    //         unit_amount: plan.price * 100, // Stripe expects the price in cents, so multiply by 100
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   success_url: `https://cautious-journey-5xx4666q445cvjp5-5173.app.github.dev?success=true`,
    //   cancel_url: `https://cautious-journey-5xx4666q445cvjp5-5173.app.github.dev?canceled=true`,
    // });

    // res.redirect(303, session.url);

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
      // existingSubscription.paymentIntentId = paymentIntent.id;
      await existingSubscription.save();
    } else {
      // const session = await stripe.checkout.sessions.create({
      //   line_items: [
      //     {
      //       price_data: {
      //         currency: "usd", // Specify the currency
      //         product_data: {
      //           name: plan.name, // Optionally include the product name
      //           // You can also add other product details here if necessary
      //         },
      //         unit_amount: plan.price * 100, // Stripe expects the price in cents, so multiply by 100
      //       },
      //       quantity: 1,
      //     },
      //   ],
      //   mode: "payment",
      //   success_url: `https://cautious-journey-5xx4666q445cvjp5-5173.app.github.dev?success=true`,
      //   cancel_url: `https://cautious-journey-5xx4666q445cvjp5-5173.app.github.dev?canceled=true`,
      // });

      // res.redirect(303, session.url);

      existingSubscription = new Subscribe({
        user: req.params.userId,
        plan: planId,
        startDate: today,
        endDate: endDate,
        isActive: today < endDate,
        // paymentIntentId: paymentIntent.id,
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
