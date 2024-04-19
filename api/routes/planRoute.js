import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { plans } from "../controllers/planController.js";

const router = express.Router();

router.get("/plans", plans);

export default router;
