import { Customer } from '../models/customerModel.js';
import Diet from '../models/dietModel.js';
import { errorHandler } from '../utils/error.js';


export const createDiet = async (req, res, next) => {
    const { date, day, time, meal, foodDescription, calorie } = req.body;

    if (!day || !meal || !foodDescription) {
        next(errorHandler(400, 'All fields are required'));
    }

    
    const userId = req.params.userId
    const customerId = req.params.customerId
    
    
    if (req.user.id !== userId) {
        next(errorHandler(401, 'Unauthorized'));
    }

    const newDiet = new Diet({
        userId: userId,
        customerId: customerId,
        date,
        day,
        time,
        meal,
        foodDescription,
        calorie
    });
    try {
        const savedDiet = await newDiet.save();
        res.status(200).json(savedDiet);
    } catch (error) {
        next(error);
    }
}


export const getDietCustomerSide = async (req, res, next) => {
    try {
        const diet = await Diet.find({ customerId: req.params.customerId });
        res.status(200).json(diet);
    } catch (error) {
        next(error);
    }
}


export const getAllDietCoachSide = async (req, res, next) => {
    try {
        const breakfast = await Diet.find({ userId: req.params.userId });
        res.status(200).json(breakfast);
    } catch (error) {
        next(error);
    }
}


export const getADietCoachSide = async (req, res, next) => {
    try {
        const breakfast = await Diet.findOne({ userId: req.params.userId, _id: req.params._id });
        res.status(200).json(breakfast);
    } catch (error) {
        next(error);
    }
}
