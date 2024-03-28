import express from "express";
import {
  getASetForCustomer,
  getASetForCoach,
  getAllExercies,
  getExercies,
  createExercies,
  updateExercies,
  deleteExercies,
  coachSetExerciesToCustomer,
  getSetExerciesForCustomer,
  getSetExerciesCoachSide,
  getSetExerciesCoachSideForACustomer,
  updateSetExercies,
  deleteSetExercies,
  getAnExercies,
} from "../controllers/exerciesController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/getAllExercies", verifyToken, getAllExercies);
router.get("/getExercies/:userId", verifyToken, getExercies);
router.get("/getAnExercies/:userId/:_id", verifyToken, getAnExercies);
router.post("/createExercies/:_id", verifyToken, createExercies);
router.put("/updateExercies/:userId/:_id", verifyToken, updateExercies);
router.delete("/deleteExercies/:userId/:_id", verifyToken, deleteExercies);

router.post(
  "/coachSetExerciesToCustomer/:customerId/:exerciseId",
  verifyToken,
  coachSetExerciesToCustomer
);
router.get(
  "/getSetExerciesForCustomer/:customerId",
  verifyToken,
  getSetExerciesForCustomer
);
router.get(
  "/getSetExerciesCoachSide/:userId",
  verifyToken,
  getSetExerciesCoachSide
);
router.get(
  "/getSetExerciesCoachSideForACustomer/:userId/:customerId",
  verifyToken,
  getSetExerciesCoachSideForACustomer
);
router.put("/updateSetExercies/:userId/:_id", verifyToken, updateSetExercies);
router.delete(
  "/deleteSetExercies/:userId/:_id",
  verifyToken,
  deleteSetExercies
);

router.get(
  "/getASetForCustomer/:customerId/:_id",
  verifyToken,
  getASetForCustomer
);
router.get("/getASetForCoach/:userId/:_id", verifyToken, getASetForCoach);

export default router;
