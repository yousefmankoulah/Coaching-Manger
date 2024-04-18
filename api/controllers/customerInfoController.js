import { Customer, CustomerExercies } from "../models/customerModel.js";
import { errorHandler } from "../utils/error.js";

export const addCustomerInfo = async (req, res, next) => {
  const {
    customerCurrentWeight,
    customerTargetWeight,
    customerCurrentHeight,
    customerCurrentAge,
  } = req.body;
  if (req.user.id === req.params.customerId) {
    const newCustomerInfo = new Customer({
      userId: req.params.userId,
      customerId: req.params.customerId,
      customerCurrentWeight,
      customerTargetWeight,
      customerCurrentHeight,
      customerCurrentAge,
    });
    try {
      const savedCustomerInfo = await newCustomerInfo.save();
      res.status(200).json(savedCustomerInfo);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You are not allowed to perform this action"));
  }
};

export const getCustomerInfo = async (req, res, next) => {
  try {
    if (
      req.user.id === req.params.customerId ||
      req.user.isAdmin === true ||
      req.user.id === req.params.userId
    ) {
      const customerInfo = await Customer.findOne({
        customerId: req.params.customerId,
      });
      res.status(200).json(customerInfo);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const updateCutomerInfo = async (req, res, next) => {
  const {
    customerCurrentWeight,
    customerTargetWeight,
    customerCurrentHeight,
    customerCurrentAge,
  } = req.body;
  if (req.user.id === req.params.customerId) {
    try {
      const updatedCustomerInfo = await Customer.findByIdAndUpdate(
        req.params._id,
        {
          $set: {
            customerCurrentWeight,
            customerTargetWeight,
            customerCurrentHeight,
            customerCurrentAge,
          },
        },
        { new: true }
      );
      res.status(200).json(updatedCustomerInfo);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You are not allowed to perform this action"));
  }
};

export const addCustomerExerciesInfo = async (req, res, next) => {
  const { date, time, maxCarringWeight, minCarringWeight, timeSpend } =
    req.body;
  if (req.user.id === req.params.customerId) {
    const newCustomerExerciesInfo = new CustomerExercies({
      userId: req.params.userId,
      customerId: req.params.customerId,
      setExerciesToCustomerId: req.params.setExerciesToCustomerId,
      date,
      time,
      maxCarringWeight,
      minCarringWeight,
      timeSpend,
    });
    try {
      const savedCustomerExerciesInfo = await newCustomerExerciesInfo.save();
      res.status(200).json(savedCustomerExerciesInfo);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You are not allowed to perform this action"));
  }
};

export const getAllCustomerExerices = async (req, res, next) => {
  try {
    if (
      req.user.id === req.params.customerId ||
      req.user.isAdmin === true ||
      req.user.id === req.params.userId
    ) {
      const customerExercies = await CustomerExercies.find({
        customerId: req.params.customerId,
      });
      res.status(200).json(customerExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const getACustomerExerices = async (req, res, next) => {
  try {
    if (req.user.id === req.params.customerId || req.user.isAdmin === true) {
      const customerExercies = await CustomerExercies.findById(req.params._id);
      res.status(200).json(customerExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const getCustomerExerciesBySetExerciesId = async (req, res, next) => {
  try {
    if (
      req.user.id === req.params.customerId ||
      req.user.isAdmin === true ||
      req.user.id === req.params.userId
    ) {
      const customerExercies = await CustomerExercies.find({
        setExerciesToCustomerId: req.params.setExerciesToCustomerId,
      });
      res.status(200).json(customerExercies);
    } else {
      next(errorHandler(401, "You are not allowed to perform this action"));
    }
  } catch (error) {
    next(error);
  }
};

export const updateCustomerExerciesInfo = async (req, res, next) => {
  const { date, time, maxCarringWeight, minCarringWeight, timeSpend } =
    req.body;
  if (req.user.id === req.params.customerId) {
    try {
      const updatedCustomerExerciesInfo =
        await CustomerExercies.findByIdAndUpdate(
          req.params._id,
          {
            $set: {
              date,
              time,
              maxCarringWeight,
              minCarringWeight,
              timeSpend,
            },
          },
          { new: true }
        );
      res.status(200).json(updatedCustomerExerciesInfo);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You are not allowed to perform this action"));
  }
};

export const deleteCustomerExercies = async (req, res, next) => {
  if (req.user.id === req.params.customerId || req.user.isAdmin === true) {
    try {
      const deletedCustomerExercies = await CustomerExercies.findByIdAndDelete(
        req.params._id
      );
      res.status(200).json("deletedCustomerExercies");
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You are not allowed to perform this action"));
  }
};
