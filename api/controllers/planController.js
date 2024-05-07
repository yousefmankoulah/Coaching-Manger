import { User, Plan, Subscribe } from "../models/userModel.js";
import Stripe from "stripe";

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

// export const createSubscription = async (req, res, next) => {
//   const endpointSecret = "whsec_8CGX3Ol4Tl8LVzaZL6BBG6NCC4HkbCdF";
//   const sig = req.headers["stripe-signature"];

//   let event = req.body;
//   try {
//     event = stripeInstance.webhooks.constructEvent(
//       req.body,
//       sig,
//       endpointSecret,
//       {
//         apiKey: process.env.STRIPE_SECRET_KEY,
//       }
//     );
//     console.log(event);

//     switch (event.type) {
//       case "checkout.session.completed":
//         // Handle checkout session completed event
//         console.log("Checkout session completed:", event);
//         break;
//       case "customer.subscription.created":
//         // Handle customer subscription created event
//         console.log("Customer subscription created:", event);
//         break;
//       // Add more cases for other event types as needed
//       default:
//         console.log(`Unhandled event type: ${event.type}`);
//     }

//     //----------------------------------------------------

//     const customers = await stripeInstance.customers.list(
//       {
//         email: req.user.email,
//         limit: 1,
//       },
//       {
//         apiKey: process.env.STRIPE_SECRET_KEY,
//       }
//     );
//     if (customers.data.length === 0) {
//       console.log("No customer found with that email.");
//       return [];
//     }
//     // Get customer ID
//     const customerId = customers.data[0].id;

//     // Retrieve subscriptions for the customer ID
//     const subscriptions = await stripeInstance.subscriptions.list(
//       { customer: customerId },
//       { apiKey: process.env.STRIPE_SECRET_KEY }
//     );

//     const today = new Date();
//     // Map over subscriptions and log details
//     await Promise.all(
//       subscriptions.data.map(async (subscription) => {
//         const user = await User.findById(req.user.id);
//         if (!user) {
//           return next(new Error("User not found."));
//         }
//         let existingSubscription = await Subscribe.findOne({
//           user: req.user.id,
//         });

//         let isActive;
//         if (subscription.status === "active") {
//           isActive = true;
//         } else {
//           isActive = false;
//           if (today > new Date(subscription.current_period_end * 1000)) {
//             isActive = false;
//           }
//         }
//         //saving the subscription  in database
//         if (existingSubscription) {
//           existingSubscription.plan = subscription.plan.product;
//           existingSubscription.startDate = new Date(
//             subscription.current_period_start * 1000
//           );
//           existingSubscription.endDate = new Date(
//             subscription.current_period_end * 1000
//           );
//           existingSubscription.isActive = subscription.status;
//           await existingSubscription.save();
//         } else {
//           existingSubscription = new Subscribe({
//             user: req.user.id,
//             plan: subscription.plan.product,
//             startDate: new Date(subscription.current_period_start * 1000),
//             endDate: new Date(subscription.current_period_end * 1000),
//             isActive: subscription.status,
//           });
//           await existingSubscription.save();
//         }
//         user.plan = subscription.plan.product;
//         user.isActive = isActive;
//         await user.save();
//         res.status(existingSubscription ? 200 : 201).json(existingSubscription);
//       })
//     );
//     res.status(200).end();
//   } catch (error) {
//     res.status(400).send(error.message);
//     next(error);
//   }
// };

export const createSubscription = async (email, customerId, planId) => {
  try {
    const subscriptions = await stripeInstance.subscriptions.list(
      { customer: customerId },
      { apiKey: process.env.STRIPE_SECRET_KEY }
    );

    const today = new Date();
    // Map over subscriptions and log details
    await Promise.all(
      subscriptions.data.map(async (subscription) => {
        const user = await User.findOne({ email: email });
        if (!user) {
          throw new Error("User not found.");
        }
        const userId = user._id.toString();

        let isActive = subscription.status === "active";
        if (
          !isActive &&
          today > new Date(subscription.current_period_end * 1000)
        ) {
          isActive = false;
        }

        let existingSubscription = await Subscribe.findOne({ user: userId });
        if (existingSubscription) {
          existingSubscription.plan = subscription.plan.product;
          existingSubscription.startDate = new Date(
            subscription.current_period_start * 1000
          );
          existingSubscription.endDate = new Date(
            subscription.current_period_end * 1000
          );
          existingSubscription.isActive = subscription.status;
          await existingSubscription.save();
        } else {
          existingSubscription = new Subscribe({
            user: userId,
            plan: subscription.plan.product,
            startDate: new Date(subscription.current_period_start * 1000),
            endDate: new Date(subscription.current_period_end * 1000),
            isActive: subscription.status,
          });
          await existingSubscription.save();
        }

        user.plan = subscription.plan.product;
        user.isActive = isActive;
        if (
          planId === "price_1PAM62JbnMJW8yX9GhDx90nE" ||
          planId === "price_1P8pNeJbnMJW8yX9ykWAsEE0" ||
          planId === "price_1P7j5sJbnMJW8yX9LWItDC1d"
        ) {
          user.validCustomers = 100;
        } else if (
          planId === "price_1PAM5pJbnMJW8yX9LUrmdPn2" ||
          planId === "price_1P8pOmJbnMJW8yX9ilerUtrX" ||
          planId === "price_1P7j6MJbnMJW8yX93F8AVccU"
        ) {
          user.validCustomers = 500;
        } else if (
          planId === "price_1PAM5bJbnMJW8yX9USVmrvhw" ||
          planId === "price_1P8pR5JbnMJW8yX9Avsgyctd" ||
          planId === "price_1P7j7HJbnMJW8yX93JaWmQDV"
        ) {
          user.validCustomers = 1000;
        } else if (
          planId === "price_1P7j8vJbnMJW8yX9qd2lUqmI" ||
          planId === "price_1P8pRYJbnMJW8yX9W6Qvhvmq"
        ) {
          user.validCustomers = 5000;
        }
        await user.save();
        res.status(existingSubscription ? 200 : 201).json(existingSubscription);
      })
    );
  } catch (error) {
    throw new Error(`Subscription Creation Error: ${error.message}`);
  }
};

export const webhook = async (req, res, next) => {
  try {
    const body = req.body;
    const eventType = body.type;

    // Check if the event type is relevant for subscription creation or update
    if (
      eventType === "customer.subscription.created" ||
      eventType === "customer.subscription.updated" ||
      eventType === "subscription_schedule.completed"
    ) {
      const customerId = body.data.object.customer;

      // Check if customerId is valid
      if (customerId) {
        const customer = await stripeInstance.customers.retrieve(customerId, {
          apiKey: process.env.STRIPE_SECRET_KEY,
        });
        const planId = body.data.object.plan.id;
        const email = customer.email;
        // Call createSubscription function
        await createSubscription(email, customerId, planId);
      } else {
        throw new Error("Invalid customerId");
      }
    } else if (
      eventType === "subscription_schedule.canceled" ||
      eventType === "customer.subscription.deleted" ||
      eventType === "customer.deleted"
    ) {
      const customerId = body.data.object.customer;

      // Check if customerId is valid
      if (customerId) {
        const customer = await stripeInstance.customers.retrieve(customerId, {
          apiKey: process.env.STRIPE_SECRET_KEY,
        });
        const email = customer.email;

        const user = await User.findOne({ email: email });
        user.isActive = false;
        await user.save();

        const sub = await Subscribe.findOne({
          user: user._id,
        });
        sub.isActive = false;
        await sub.save();
      } else {
        throw new Error("Invalid customerId");
      }
    }

    res.status(200).end();
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`);
    res.status(400).send(`Webhook Error: ${error.message}`);
    next(error);
  }
};
