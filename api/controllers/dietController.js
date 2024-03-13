import { Customer } from "../models/customerModel.js";
import Diet from "../models/dietModel.js";
import { errorHandler } from "../utils/error.js";

export const createDiet = async (req, res, next) => {
  const { date, day, time, meal, foodDescription, calorie } = req.body;

  if (!day || !meal || !foodDescription) {
    next(errorHandler(400, "All fields are required"));
  }

  const coach = await User.findById(req.user.id);
  if (coach.role !== "coach") {
    next(errorHandler(400, "You are not allowed to perform this action"));
  }

  const userId = req.params.userId;
  const customerId = req.params.customerId;

  if (req.user.id !== userId) {
    next(errorHandler(401, "Unauthorized"));
  }

  const newDiet = new Diet({
    userId: userId,
    customerId: customerId,
    date,
    day,
    time,
    meal,
    foodDescription,
    calorie,
  });
  try {
    const savedDiet = await newDiet.save();
    res.status(200).json(savedDiet);
  } catch (error) {
    next(error);
  }
};

export const getDietCustomerSide = async (req, res, next) => {
  try {
    const diet = await Diet.find({ customerId: req.params.customerId });
    res.status(200).json(diet);
  } catch (error) {
    next(error);
  }
};

export const getAllDietCoachSide = async (req, res, next) => {
  try {
    const breakfast = await Diet.find({ userId: req.params.userId });
    res.status(200).json(breakfast);
  } catch (error) {
    next(error);
  }
};

export const getADietCoachSide = async (req, res, next) => {
  try {
    const breakfast = await Diet.findOne({
      userId: req.params.userId,
      _id: req.params._id,
    });
    res.status(200).json(breakfast);
  } catch (error) {
    next(error);
  }
};

export const updateDiet = async (req, res, next) => {
  const { date, day, time, meal, foodDescription, calorie } = req.body;
  const diet = await Diet.findById(req.params._id);
  const coach = await User.findById(req.user.id);
  if (coach.role !== "coach") {
    next(errorHandler(400, "You are not allowed to perform this action"));
  }

  if (req.user.id !== req.params.userId) {
    next(errorHandler(401, "Unauthorized"));
  }

  if (!diet) {
    return next(errorHandler(404, "Diet not found"));
  }

  try {
    const updatedDiet = await Diet.findByIdAndUpdate(
      req.params._id,
      {
        $set: { date, day, time, meal, foodDescription, calorie },
      },
      { new: true }
    );
    res.status(200).json(updatedDiet);
  } catch (error) {
    next(error);
  }
};

export const deleteDiet = async (req, res, next) => {
  try {
    if (req.params.userId !== req.user.id) {
      next(errorHandler(401, "Unauthorized"));
    } else {
      const diet = await Diet.findByIdAndDelete(req.params._id);
      res.status(200).json("Diet has been deleted");
    }
  } catch (error) {
    next(error);
  }
};
