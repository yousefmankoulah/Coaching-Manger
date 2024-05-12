import mongoose from "mongoose";
// import {User} from "../models/userModel.js";
// import { AddCustomerInfo } from "../models/customerModel.js";

const dietSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Define userId as ObjectId
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId, // Define customerId as ObjectId
      ref: "addCustomerInfo",
      required: true,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    meal: {
      type: String,
    },
    foodDescription: {
      type: String,
      required: true,
    },
    calorie: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Diet = mongoose.model("diet", dietSchema);
export default Diet;
