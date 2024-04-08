import mongoose from "mongoose";
import User from "../models/userModel.js";
import { Exercies, SetExerciesToCustomer } from "../models/exerciesModel.js";

const addCustomerInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Define userId as ObjectId
      ref: 'User',
      required: true,
    },
    // customerId: {
    //   type: String,
    //   required: true,
    // },

    customerName: {
      type: String,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
    },
    customerPassword: {
      type: String,
      required: true,
    },
    customerPhone: { type: String },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    role: {
      type: String,
      default: "customer",
    },
  },
  { timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Define userId as ObjectId
      ref: 'User',
      required: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId, // Define customerId as ObjectId
      ref: 'AddCustomerInfo',
      required: true,
    },
    customerCurrentWeight: {
      type: Number,
    },
    customerTargetWeight: {
      type: Number,
    },
    customerCurrentHeight: {
      type: Number,
    },
    customerCurrentAge: {
      type: Number,
    },
  },
  { timestamps: true }
);

const customerExerciesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Define userId as ObjectId
      ref: 'User',
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId, // Define customerId as ObjectId
      ref: 'AddCustomerInfo',
      required: true,
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    setExerciesToCustomerId: {
      type: mongoose.Schema.Types.ObjectId, // Define customerId as ObjectId
      ref: 'setExerciesToCustomerSchema',
      required: true,
    },
    maxCarringWeight: {
      type: Number,
    },
    minCarringWeight: {
      type: Number,
    },
    timeSpend: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
const AddCustomerInfo = mongoose.model(
  "addCustomerInfo",
  addCustomerInfoSchema
);
const CustomerExercies = mongoose.model(
  "CustomerExercies",
  customerExerciesSchema
);

export { Customer, AddCustomerInfo, CustomerExercies };
