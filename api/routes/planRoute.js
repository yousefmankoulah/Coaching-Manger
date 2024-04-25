import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createSubscription,
  paymentSuccess,
  plansMonthly,
  plansYearly,
  getAPlan,
} from "../controllers/planController.js";

const router = express.Router();

router.get("/plans", plansMonthly);
router.get("/plansYearly", plansYearly);
router.get("/getAPlan/:_id", getAPlan);

router.post("/create-subscription", createSubscription);
router.post("/payment-success", paymentSuccess);

export default router;
