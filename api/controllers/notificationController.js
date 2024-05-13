import { Notification } from "../models/userModel.js";

export const getNotifications = async (req, res, next) => {
  try {
    if (req.user.role === "coach") {
      const notifications = await Notification.find({
        user: req.user.id,
      });
      res.status(200).json(notifications);
    } else {
      const notifications = await Notification.find({
        customer: req.user.id,
      });
      res.status(200).json(notifications);
    }
  } catch (err) {
    next(err);
  }
};
