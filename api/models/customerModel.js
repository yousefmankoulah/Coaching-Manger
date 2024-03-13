import mongoose from "mongoose";

const addCustomerInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },

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
      type: String,
      required: true,
    },

    customerId: {
      type: String,
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
      type: String,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    time: {
      type: String,
    },
    setExerciesToCustomerId: {
      type: String,
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
