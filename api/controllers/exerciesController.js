import { Exercies, SetExerciesToCustomer } from "../models/exerciesModel.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/userModel.js";

export const getAllExercies = async (req, res, next) => {
  try {
    if (req.user.isAdmin === false) {
      const adminExercies = await Exercies.find({ userId: "admin" });
      const coachExercies = await Exercies.find({ userId: req.params._id });

      res.status(200).json(adminExercies.concat(coachExercies));
    } else {
      const exercies = await Exercies.find();
      res.status(200).json(exercies);
    }
  } catch (error) {
    next(error);
  }
};

export const getExercies = async (req, res, next) => {
  try {
    const exercies = await Exercies.find({ userId: req.user.id });
    res.status(200).json(exercies);
  } catch (error) {
    next(error);
  }
};

export const getAnExercies = async (req, res, next) => {
  try {
    const exercies = await Exercies.findById(req.params._id);
    res.status(200).json(exercies);
  } catch (error) {
    next(error);
  }
};

export const createExercies = async (req, res, next) => {
  const { exerciseName, exerciseDescription, exerciseVideo } = req.body;

  const coach = await User.findById(req.user.id);
  if (coach.role !== "coach") {
    next(errorHandler(400, "You are not allowed to perform this action"));
  }

  if (req.user.id !== req.params._id) {
    next(errorHandler(401, "You are not allowed to perform this action"));
  }

  if (!exerciseName) {
    next(errorHandler(400, "All fields are required"));
  }

  if (req.user.isAdmin === true) {
    const newExercies = new Exercies({
      userId: "admin",
      exerciseName,
      exerciseDescription,
      exerciseVideo,
    });
    try {
      const savedExercies = await newExercies.save();
      res.status(200).json(savedExercies);
    } catch (error) {
      next(error);
    }
  } else {
    const newExercies = new Exercies({
      userId: req.user.id,
      exerciseName,
      exerciseDescription,
      exerciseVideo,
    });
    try {
      const savedExercies = await newExercies.save();
      res.status(200).json(savedExercies);
    } catch (error) {
      next(error);
    }
  }
};

export const updateExercies = async (req, res, next) => {
  const { exerciseName, exerciseDescription, exerciseVideo } = req.body;

  try {
    const coach = await User.findById(req.user.id);
    if (coach.role !== "coach") {
      next(errorHandler(400, "You are not allowed to perform this action"));
    }
    if (req.user.id === req.params.userId || req.user.isAdmin === true) {
      const updatedExercies = await Exercies.findByIdAndUpdate(
        req.params._id,
        {
          $set: { exerciseName, exerciseDescription, exerciseVideo },
        },
        { new: true }
      );
      res.status(200).json(updatedExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteExercies = async (req, res, next) => {
  try {
    const coach = await User.findById(req.user.id);
    if (coach.role !== "coach") {
      next(errorHandler(400, "You are not allowed to perform this action"));
    }
    if (req.user.id === req.params.userId || req.user.isAdmin === true) {
      const deletedExercies = await Exercies.findByIdAndDelete(req.params._id);
      res.status(200).json("deletedExercies");
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const coachSetExerciesToCustomer = async (req, res, next) => {
  const { date, time, setNumbers } = req.body;
  const exerciseId = req.params.exerciseId;
  const exercies = new SetExerciesToCustomer({
    userId: req.user.id,
    customerId: req.params.customerId,
    exerciseId,
    date,
    time,
    setNumbers,
  });
  try {
    const savedExercies = await exercies.save();
    const getTheExercies = await SetExerciesToCustomer.findOne({
      customerId: req.params.customerId,
      _id: savedExercies._id,
    });
    const exerciesById = await Exercies.findById({ _id: exerciseId });
    res.status(200).json({ getTheExercies, exerciesById });
  } catch (error) {
    next(error);
  }
};

//get coach side and customer side update delete

export const getSetExerciesForCustomer = async (req, res, next) => {
  try {
    if (req.user.id === req.params.customerId || req.user.isAdmin === true) {
      const setExercies = await SetExerciesToCustomer.find({
        customerId: req.params.customerId,
      });
      res.status(200).json(setExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const getSetExerciesCoachSide = async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin === true) {
      const setExercies = await SetExerciesToCustomer.find({
        userId: req.params.userId,
      });
      res.status(200).json(setExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const getSetExerciesCoachSideForACustomer = async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin === true) {
      const setExercies = await SetExerciesToCustomer.find({
        userId: req.params.userId,
        customerId: req.params.customerId,
      });
      res.status(200).json(setExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const getASetForCoach = async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin === true) {
      const setExercies = await SetExerciesToCustomer.findById(req.params._id);
      const exerciesById = await Exercies.findById({
        _id: setExercies.exerciseId,
      });
      res.status(200).json({ setExercies, exerciesById });
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const getASetForCustomer = async (req, res, next) => {
  try {
    if (req.user.id === req.params.customerId || req.user.isAdmin === true) {
      const setExercies = await SetExerciesToCustomer.findById(req.params._id);
      const exerciesById = await Exercies.findById({
        _id: setExercies.exerciseId,
      });
      res.status(200).json({ setExercies, exerciesById });
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const updateSetExercies = async (req, res, next) => {
  const { date, time, setNumbers } = req.body;
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin === true) {
      const updatedSetExercies = await SetExerciesToCustomer.findByIdAndUpdate(
        req.params._id,
        {
          $set: { date, time, setNumbers },
        },
        { new: true }
      );
      res.status(200).json(updatedSetExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteSetExercies = async (req, res, next) => {
  try {
    if (req.user.id === req.params.userId || req.user.isAdmin === true) {
      const deletedSetExercies = await SetExerciesToCustomer.findByIdAndDelete(
        req.params._id
      );
      res.status(200).json("deletedSetExercies");
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};
