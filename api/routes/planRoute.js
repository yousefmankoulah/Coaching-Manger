import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createSubscription,
  paymentSuccess,
  plans,
} from "../controllers/planController.js";

const router = express.Router();

router.get("/plans", plans);
router.post("/create-subscription", createSubscription);
router.post("/payment-success", paymentSuccess);

export default router;
