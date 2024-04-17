import express from "express";
import {
  addCustomerInfo,
  getCustomerInfo,
  updateCutomerInfo,
  addCustomerExerciesInfo,
  getAllCustomerExerices,
  getCustomerExerciesBySetExerciesId,
  updateCustomerExerciesInfo,
  deleteCustomerExercies,
} from "../controllers/customerInfoController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

//Not tested yet
router.post(
  "/addCustomerInfo/:userId/:customerId",
  verifyToken,
  addCustomerInfo
);
router.get("/getCustomerInfo/:customerId", verifyToken, getCustomerInfo);
router.put(
  "/updateCutomerInfo/:customerId/:_id",
  verifyToken,
  updateCutomerInfo
);

router.post(
  "/addCustomerExerciesInfo/:userId/:customerId/:setExerciesToCustomerId",
  verifyToken,
  addCustomerExerciesInfo
);
router.get(
  "/getAllCustomerExerices/:customerId",
  verifyToken,
  getAllCustomerExerices
);
router.get(
  "/getCustomerExerciesBySetExerciesId/:userId/:customerId/:setExerciesToCustomerId",
  verifyToken,
  getCustomerExerciesBySetExerciesId
);
router.put(
  "/updateCustomerExerciesInfo/:customerId/:_id",
  verifyToken,
  updateCustomerExerciesInfo
);
router.delete(
  "/deleteCustomerExercies/:customerId/:_id",
  verifyToken,
  deleteCustomerExercies
);

export default router;
