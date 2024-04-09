import mongoose from "mongoose";
import User from "../models/userModel.js";
import { AddCustomerInfo } from "../models/customerModel.js";

const excersieSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Define userId as ObjectId
    ref: User,
    required: true,
  },
  exerciseName: {
    type: String,
    required: true,
  },
  exerciseDescription: {
    type: String,
  },
  exerciseVideo: {
    type: String,
  },
});

const Exercies = mongoose.model("Exercies", excersieSchema);

const setExerciesToCustomerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Define userId as ObjectId
      ref: User,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId, // Define customerId as ObjectId
      ref: "AddCustomerInfo",
      required: true,
    },
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId, // Define customerId as ObjectId
      ref: Exercies,
      required: true,
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    setNumbers: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const SetExerciesToCustomer = mongoose.model(
  "SetExerciesToCustomer",
  setExerciesToCustomerSchema
);

export { Exercies, SetExerciesToCustomer };
