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
import bodyParser from "body-parser";

const router = express.Router();

router.get("/plans", plansMonthly);
router.get("/plansYearly", plansYearly);
router.get("/getAPlan/:_id", getAPlan);
router.get("/getTheSubscriptions/:_id", verifyToken, getTheSubscriptions);

router.post("/create-subscription", verifyToken, createSubscription);
router.use(bodyParser.raw({ type: "application/json" }));

router.post("/webhook", webhook);

// express.raw({ type: "application/json" })

export default router;
