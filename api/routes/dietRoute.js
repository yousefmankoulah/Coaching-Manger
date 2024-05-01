import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  createDiet,
  getDietCustomerSide,
  getAllDietCoachSide,
  getADietCoachSide,
  deleteDiet,
  updateDiet,
  todoList,
} from "../controllers/dietController.js";

const router = express.Router();

router.post("/createDiet/:userId/:customerId", verifyToken, createDiet);
router.get("/getDiet/:customerId", verifyToken, getDietCustomerSide);
router.get("/getAllDiet/:userId", verifyToken, getAllDietCoachSide);
router.get("/getADiet/:userId/:_id", verifyToken, getADietCoachSide);
router.delete("/deleteDiet/:userId/:_id", verifyToken, deleteDiet);
router.put("/updateDiet/:userId/:_id", verifyToken, updateDiet);

router.get("/todoList/:customerId", verifyToken, todoList);

export default router;
