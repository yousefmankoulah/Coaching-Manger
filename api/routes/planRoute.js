import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createSubscription,
  plansMonthly,
  plansYearly,
  getAPlan,
  getTheSubscriptions,
  webhook,
} from "../controllers/planController.js";

const router = express.Router();

router.get("/plans", plansMonthly);
router.get("/plansYearly", plansYearly);
router.get("/getAPlan/:_id", getAPlan);
router.get("/getTheSubscriptions/:_id", verifyToken, getTheSubscriptions);

router.post("/create-subscription/:userId/:_id", createSubscription);

router.post("/webhook", express.raw({ type: "application/json" }), webhook);

export default router;
