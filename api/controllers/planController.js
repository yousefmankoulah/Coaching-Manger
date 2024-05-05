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
    // const customers = await stripeInstance.customers.list(
    //   {
    //     email: email,
    //     limit: 1,
    //   },
    //   {
    //     apiKey: process.env.STRIPE_SECRET_KEY,
    //   }
    // );
    // if (customers.data.length === 0) {
    //   console.log("No customer found with that email.");
    //   return [];
    // }
    // // Get customer ID
    // const customerId = customers.data[0].id;

    // Retrieve subscriptions for the customer ID
    const subscriptions = await stripeInstance.subscriptions.list(
      { customer: customerId },
      { apiKey: process.env.STRIPE_SECRET_KEY }
    );

    const today = new Date();
    // Map over subscriptions and log details
    await Promise.all(
      subscriptions.data.map(async (subscription) => {
        const user = await User.findOne({ email: email });
        userId = user._id.toString();
        if (!user) {
          return next(new Error("User not found."));
        }
        let existingSubscription = await Subscribe.findOne({
          user: userId,
        });

        let isActive;
        if (subscription.status === "active") {
          isActive = true;
        } else {
          isActive = false;
          if (today > new Date(subscription.current_period_end * 1000)) {
            isActive = false;
          }
        }
        //saving the subscription  in database
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
            user: req.user.id,
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
          "price_1P8pNeJbnMJW8yX9ykWAsEE0" ||
          "price_1P7j5sJbnMJW8yX9LWItDC1d"
        ) {
          user.validCustomers = 100;
        } else if (
          planId === "price_1PAM5pJbnMJW8yX9LUrmdPn2" ||
          "price_1P8pOmJbnMJW8yX9ilerUtrX" ||
          "price_1P7j6MJbnMJW8yX93F8AVccU"
        ) {
          user.validCustomers = 500;
        } else if (
          planId === "price_1PAM5bJbnMJW8yX9USVmrvhw" ||
          "price_1P8pR5JbnMJW8yX9Avsgyctd" ||
          "price_1P7j7HJbnMJW8yX93JaWmQDV"
        ) {
          user.validCustomers = 1000;
        } else if (
          planId === "price_1P7j8vJbnMJW8yX9qd2lUqmI" ||
          "price_1P8pRYJbnMJW8yX9W6Qvhvmq"
        ) {
          user.validCustomers = 5000;
        }
        await user.save();
        res.status(existingSubscription ? 200 : 201).json(existingSubscription);
      })
    );
    res.status(200).end();
  } catch (error) {
    res.status(400).send(error.message);
    next(error);
  }
};

export const webhook = async (req, res) => {
  const body = req.body;
  console.log("Raw Request Body:", body.type);
  console.log(body.data.object.customer);

  // const endpointSecret = "whsec_8CGX3Ol4Tl8LVzaZL6BBG6NCC4HkbCdF";
  // const sig = req.headers["stripe-signature"];
  // const rawBody = JSON.stringify(req.body);

  // try {
  //   // Log raw request body, signature, and endpoint secret for debugging

  //   let event = stripeInstance.webhooks.constructEvent(
  //     rawBody,
  //     sig,
  //     endpointSecret
  //   );

  switch (body.type) {
    case "checkout.session.completed":
      // Handle checkout session completed event

      // Do something with the data received from the front end
      console.log("Checkout session completed:", body.id);
      break;
    case "customer.subscription.created":
      // Handle customer subscription created event
      console.log("Customer subscription created:");
      break;
    // Add more cases for other event types as needed
    default:
      console.log(`Unhandled event type:`);
  }

  res.status(200).end(); // Respond to Stripe with a 200 status code
};
