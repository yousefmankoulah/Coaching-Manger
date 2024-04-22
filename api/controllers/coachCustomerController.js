import {
  AddCustomerInfo,
  Customer,
  CustomerExercies,
} from "../models/customerModel.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import passwordValidator from "password-validator";
import Diet from "../models/dietModel.js";
import { SetExerciesToCustomer } from "../models/exerciesModel.js";

const schema = new passwordValidator();

export const addCustomer = async (req, res, next) => {
  const { customerName, customerEmail, customerPassword, customerPhone } =
    req.body;

  try {
    // Check if required fields are provided
    if (!customerName || !customerEmail || !customerPassword) {
      throw errorHandler(400, "All fields are required");
    }

    // Check if the current user is a coach
    const coach = await User.findById(req.user.id);
    if (!coach || coach.role !== "coach") {
      throw errorHandler(400, "You are not allowed to perform this action");
    }

    // Check if customer already exists
    const checkCustomer = await AddCustomerInfo.findOne({ customerEmail });
    const user = await User.findOne({ email: customerEmail });
    if (checkCustomer) {
      throw errorHandler(400, "Customer already exists");
    }
    if (user) {
      throw errorHandler(400, "This Email used by a Coach account");
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(customerPassword, 10);

    // Create a new customer object
    const newCustomer = new AddCustomerInfo({
      userId: req.user.id,
      customerName,
      customerEmail,
      customerPassword: hashedPassword,
      customerPhone,
    });

    // Save the new customer to the database
    await newCustomer.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      newCustomer,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCustomers = async (req, res, next) => {
  try {
    const customers = await AddCustomerInfo.find({ userId: req.user.id });
    res.status(200).json(customers);
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await AddCustomerInfo.findOne({
      userId: req.params.userId,
      _id: req.params._id,
    });
    res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};

//Didn't complet it
export const updateCustomer = async (req, res, next) => {
  const {
    customerName,
    customerEmail,
    customerPassword,
    customerPhone,
    profilePicture,
  } = req.body;

  const customer = await AddCustomerInfo.findById(req.params._id);

  if (req.user.id === req.params._id || req.user.id === req.params.userId) {
    if (!customer) {
      return next(errorHandler(404, "User not found"));
    }

    if (req.body.customerPassword) {
      schema.is().min(8).is().max(100).has().uppercase().has().lowercase();

      if (!schema.validate(customerPassword)) {
        return next(
          errorHandler(
            400,
            "Password must be at least 8 characters long and contain at least one uppercase letter and one lowercase letter"
          )
        );
      }
      req.body.customerPassword = bcrypt.hashSync(
        req.body.customerPassword,
        10
      );
    }

    try {
      const updatedUser = await AddCustomerInfo.findByIdAndUpdate(
        {
          _id: req.params._id,
        },
        {
          $set: {
            customerName: req.body.customerName,
            customerEmail: req.body.customerEmail,
            customerPhone: req.body.customerPhone,
            customerPassword: req.body.customerPassword,
            profilePicture: req.body.profilePicture,
          },
        },
        { new: true }
      );
      const { customerPassword, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
};

export const deleteCustomer = async (req, res, next) => {
  if (req.user.id === req.params._id || req.user.id === req.params.userId) {
    try {
      const customer = await AddCustomerInfo.findOneAndDelete({
        userId: req.params.userId,
        _id: req.params._id,
      });

      const diet = await Diet.deleteMany({
        userId: req.params.userId,
        customerId: req.params._id,
      });

      const customerInfo = await Customer.findOneAndDelete({
        userId: req.params.userId,
        customerId: req.params._id,
      });

      const customerEx = await CustomerExercies.deleteMany({
        userId: req.params.userId,
        customerId: req.params._id,
      });

      const setEx = await SetExerciesToCustomer.deleteMany({
        userId: req.params.userId,
        customerId: req.params._id,
      });

      const coach = await User.findById(req.user.id);
      if (coach.role !== "coach") {
        next(errorHandler(400, "You are not allowed to perform this action"));
      }
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(401, "You are not allowed to perform this action"));
  }
};
