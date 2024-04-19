import { User, Plan, Subscribe } from "../models/userModel.js";

export const plans = async (req, res, next) => {
  try {
    const plans = await Plan.find().sort({ price: 1 });
    res.json(plans);
  } catch (err) {
    next(err);
  }
};
