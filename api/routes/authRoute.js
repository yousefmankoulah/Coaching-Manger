import express from "express";
import {
  signup,
  signin,
  customerSignin,
  signout,
  updateUser,
  signinGoogle,
  getCoachProfile,
  deleteCoach,
  sendPasswordResetEmailforCustomer,
  sendPasswordResetEmailforCoach,
} from "../controllers/authController.js";
import { verifyToken } from "../utils/verifyUser.js";

import {
  getNotificationsCoach,
  getNotificationsCustomer,
  NotificationRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/customerSignin", customerSignin);
router.post("/signout", signout);
router.put("/updateUser/:_id", verifyToken, updateUser);
router.post("/google", signinGoogle);
router.get("/coachProfile/:_id", getCoachProfile);
router.delete("/deleteCoach/:_id", deleteCoach);

router.get("/notifyCoach/:userId", verifyToken, getNotificationsCoach);
router.get(
  "/notifyCustomer/:userId/:customerId",
  verifyToken,
  getNotificationsCustomer
);

router.put("/notifyRead/:_id/", verifyToken, NotificationRead);

//forget password
router.post("/forgetPasswordCoach", sendPasswordResetEmailforCoach);
router.post("/forgetPasswordCustomer", sendPasswordResetEmailforCustomer);


export default router;
