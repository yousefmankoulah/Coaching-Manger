import { Notification } from "../models/userModel.js";

export const getNotificationsCoach = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
      classification: "coach",
    }).sort({ date: -1 });

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
      classification: "diet" || "assign",
    }).sort({ date: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    next(err);
  }
};

export const NotificationRead = async (req, res, next) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params._id,
      { status: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    next(error);
  }
};
