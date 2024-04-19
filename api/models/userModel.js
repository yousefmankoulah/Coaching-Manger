import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "coach",
    },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },
  },

  { timestamps: true }
);

const planSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  validityDays: {
    type: Number,
    default: 30,
  },
});


const subscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});


const Plan = mongoose.model("Plan", planSchema);
const User = mongoose.model("User", userSchema);
const Subscribe = mongoose.model("Subscribe", subscriptionSchema)

export { User, Plan, Subscribe };
