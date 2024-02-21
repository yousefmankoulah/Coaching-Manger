import {AddCustomerInfo} from '../models/customerModel.js'
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';


export const addCustomer = async (req, res, next) => {
    const { customerName, customerEmail, customerPassword, customerPhone } = req.body;

    
    if (!customerName || !customerEmail || !customerPassword) {
        next(errorHandler(400, 'All fields are required'));
    }


    const checkCustomer = await AddCustomerInfo.findOne({ customerEmail });
    if (checkCustomer) {
        next(errorHandler(400, 'Customer already exists'));
    }

    const generateCustomerId = Math.random().toString(36).slice(-8)
    const customerId = req.params.userId + "_" + generateCustomerId
    
    const hashedPassword = await bcrypt.hash(customerPassword, 10);

    const userId = req.params.userId

    const newCustomer = new AddCustomerInfo({
            userId: userId,
            customerId: customerId,
            customerName,
            customerEmail,
            customerPassword: hashedPassword,
            customerPhone
       
    });
    
    try{
        await newCustomer.save();
        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            newCustomer
        });
    } catch(err){
        next(error);
    }


}