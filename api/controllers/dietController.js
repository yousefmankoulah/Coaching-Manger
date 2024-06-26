import { Customer } from "../models/customerModel.js";
import Diet from "../models/dietModel.js";
import { errorHandler } from "../utils/error.js";
import { Notification, User } from "../models/userModel.js";
import { SetExerciesToCustomer } from "../models/exerciesModel.js";

export const createDiet = async (req, res, next) => {
  const { date, time, meal, foodDescription, calorie } = req.body;

  if (!meal || !foodDescription) {
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
    time,
    meal,
    foodDescription,
    calorie,
  });

  try {
    const savedDiet = await newDiet.save();
    res.status(200).json(savedDiet);
    const notify = new Notification({
      user: userId,
      customer: customerId,
      message: `Coach ${coach.fullName} has created a new diet for you, ${savedDiet.meal}`,
      postId: savedDiet._id,
      classification: "diet",
    });
    await notify.save();
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
    const breakfast = await Diet.find({ userId: req.params.userId }).populate(
      "customerId"
    );
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
    }).populate("customerId"); // Populate the customerId field
    res.status(200).json(breakfast);
  } catch (error) {
    next(error);
  }
};

export const updateDiet = async (req, res, next) => {
  const { date, day, time, meal, foodDescription, calorie } = req.body;
  const diet = await Diet.findById(req.params._id).populate("customerId");
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

export const todoList = async (req, res, next) => {
  try {
    const now = new Date();

    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const year = now.getFullYear();

    const formattedDate = `${year}-${month}-${day}`;

    // Fetching the data
    const diet = await Diet.find({
      date: formattedDate,
      customerId: req.params.customerId,
    });

    const assigned = await SetExerciesToCustomer.find({
      date: formattedDate,
      customerId: req.params.customerId,
    }).populate("exerciseId");

    // Merge both arrays into one
    const combinedArray = diet.concat(assigned);

    // Sort the combined array by time (assuming 'time' is the property to sort by)
    combinedArray.sort((a, b) => {
      // Assuming 'time' is in Date format
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeA - timeB; // Ascending order, modify as needed for descending order
    });

    // Combining both datasets into a single object

    // Correct way to set status and send JSON response
    res.status(200).json(combinedArray);
  } catch (err) {
    // Passing errors to the error-handling middleware
    next(err);
  }
};
