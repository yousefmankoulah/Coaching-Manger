import { User, Plan, Subscribe } from "../models/userModel.js";
import Stripe from "stripe";

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

/*********** create subscription ************/

const stripeSession = async (plan) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan,
          quantity: 1,
        },
      ],
      success_url:
        "https://cautious-journey-5xx4666q445cvjp5-5173.app.github.dev/success",
      cancel_url:
        "https://cautious-journey-5xx4666q445cvjp5-5173.app.github.dev/cancel",
    });
    return session;
  } catch (e) {
    return e;
  }
};

export const createSubscription = async (req, res, next) => {
  const { plan } = req.body;
  let planId = req.params._id;

  try {
    const session = await stripeSession(planId);
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscription = new Subscribe({
      user: user,
      plan: planId,
      startDate: new Date(),
      endDate: moment().add(30, "days").toDate(), // Defaulting to 30 days for example
      isActive: true,
    });

    await subscription.save();

    return res.json({ session });
  } catch (error) {
    res.status(500).send(error);
  }
};

/************ payment success ********/

export const paymentSuccess = async (req, res, next) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      const subscriptionId = session.subscription;
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );
        const subscription = await Subscribe.findOne({
          stripeSubscriptionId: subscriptionId, // Assuming this field exists in your schema
        });

        subscription.endDate = moment
          .unix(stripeSubscription.current_period_end)
          .toDate();
        await subscription.save();

        return res.json({ message: "Payment successful" });
      } catch (error) {
        console.error("Error retrieving subscription:", error);
        return res.status(500).json({ error: "Error retrieving subscription" });
      }
    } else {
      return res.json({ message: "Payment failed" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
