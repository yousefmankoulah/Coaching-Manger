import { Notification } from "../models/userModel.js";

export const getNotificationsCoach = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      classification: "coach",
    });
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

export const getNotificationsCustomer = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.params.userId,
      customer: req.user.id,
    });
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};
