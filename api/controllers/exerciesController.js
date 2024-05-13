import { Exercies, SetExerciesToCustomer } from "../models/exerciesModel.js";
import { errorHandler } from "../utils/error.js";
import { User } from "../models/userModel.js";
import { deleteFileFromStorage } from "../utils/firebaseConfig.js";

export const getAllExercies = async (req, res, next) => {
  try {
    if (req.user.isAdmin === false) {
      const adminExercies = await Exercies.find({ userId: "admin" });
      const coachExercies = await Exercies.find({ userId: req.params.userId });

      res.status(200).json(adminExercies.concat(coachExercies));
    } else {
      const exercies = await Exercies.find();
      res.status(200).json(exercies);
    }
  } catch (error) {
    next(error);
  }
};

export const getAdminExercies = async (req, res, next) => {
  try {
    const exercies = await Exercies.find({ userId: "admin" });
    res.status(200).json(exercies);
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
  const exFile = await Exercies.findById(req.params._id);
  const exfilename = exFile.exerciseVideo;
  try {
    await deleteFileFromStorage(exfilename);
    const coach = await User.findById(req.user.id);
    if (coach.role !== "coach") {
      next(errorHandler(400, "You are not allowed to perform this action"));
    }
    if (req.user.id === req.params.userId || req.user.isAdmin === true) {
      const deletedExercies = await Exercies.findByIdAndDelete(req.params._id);
      const deleteSet = await SetExerciesToCustomer.deleteMany({
        exerciseId: req.params._id,
      });
      res.status(200).json("deletedExercies");
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const coachSetExerciesToCustomer = async (req, res, next) => {
  const { date, time, setNumbers, exerciseId, customerId } = req.body;

  const exercies = new SetExerciesToCustomer({
    userId: req.user.id,
    customerId,
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
    const notify = new Notification({
      user: req.user.id,
      customer: customerId,
      message: `The Coach has Assigned a new Exercies for you ${getTheExercies.exerciseName}`,
      postId: savedExercies._id,
      classification: "assign",
    });
    await notify.save();
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
      }).populate("exerciseId");
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
      const setExercises = await SetExerciesToCustomer.find({
        userId: req.params.userId,
      })
        .populate("exerciseId")
        .populate("customerId");
      res.status(200).json(setExercises);
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
      }).populate("exerciseId");
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
      const setExercies = await SetExerciesToCustomer.findById(req.params._id)
        .populate("exerciseId")
        .populate("customerId");
      if (!setExercies) {
        return res.status(404).send("SetExercies not found");
      }

      res.status(200).json(setExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const getASetForCustomer = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.customerId && !req.user.isAdmin) {
      return next(
        errorHandler(401, "You are not allowed to perform this action")
      );
    }

    const setExercies = await SetExerciesToCustomer.findById(
      req.params._id
    ).populate("exerciseId");

    if (!setExercies) {
      return res.status(404).send("SetExercies not found");
    }

    res.status(200).json(setExercies);
  } catch (error) {
    // Proper error handling to avoid multiple response headers
    if (!res.headersSent) {
      next(error);
    }
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
