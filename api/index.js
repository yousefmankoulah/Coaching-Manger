import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/authRoute.js";
import addCustomer from "./routes/customerRoute.js";
import dietRoute from "./routes/dietRoute.js";
import exerciesRoute from "./routes/exerciesRoute.js";
import customerInfoRoute from "./routes/customerInfoRoute.js";
import planRoute from "./routes/planRoute.js";
import bodyParser from "body-parser";
import helmet from "helmet";
import morgan from "morgan";
import { Subscribe } from "./models/userModel.js";
import { Plan } from "./models/userModel.js";

dotenv.config();

//subscribe activity
const updateSubscribe = async (req, res, next) => {
  const subscribe = await Subscribe.find();
  const today = new Date();
  try {
    subscribe.map(async (sub) => {
      if (today > sub.endDate) {
        sub.isActive = false;
        await sub.save();
      } else {
        sub.isActive = true;
        await sub.save();
      }
    });
  } catch (err) {
    next(err);
  }
};

//Connect with database

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDb is connected!");
  })
  .catch((err) => {
    console.log(err);
  });

//API
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//start server
app.listen(3000, () => {
  console.log(`Server running at 3000`);
  // update the subscribe activity
  updateSubscribe();
});

//Routes
app.use("/api/auth", authRoute);
app.use("/api/userCustomer", addCustomer);
app.use("/api/diet", dietRoute);
app.use("/api/exercise", exerciesRoute);
app.use("/api/customerInfo", customerInfoRoute);
app.use("/api/plans", planRoute);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//ERROR HANDLING
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
