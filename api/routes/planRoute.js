import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createSubscription,
  plansMonthly,
  plansYearly,
  getAPlan,
  getTheSubscriptions,
} from "../controllers/planController.js";

const router = express.Router();

router.get("/plans", plansMonthly);
router.get("/plansYearly", plansYearly);
router.get("/getAPlan/:_id", getAPlan);
router.get("/getTheSubscriptions/:_id", verifyToken, getTheSubscriptions);

router.post("/create-subscription/:_id", verifyToken, createSubscription);

export default router;
