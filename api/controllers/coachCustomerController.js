import {AddCustomerInfo} from '../models/customerModel.js'
import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';
import passwordValidator from 'password-validator';


const schema = new passwordValidator();


export const addCustomer = async (req, res, next) => {
    const { customerName, customerEmail, customerPassword, customerPhone } = req.body;

    
    if (!customerName || !customerEmail || !customerPassword) {
        next(errorHandler(400, 'All fields are required'));
    }


    const checkCustomer = await AddCustomerInfo.findOne({ customerEmail });
    if (checkCustomer) {
        next(errorHandler(400, 'Customer already exists'));
    }

    const generateCustomerId = Math.random().toString(36).slice(-4)
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


export const getAllCustomers = async (req, res, next) => {

    try {
        const customers = await AddCustomerInfo.find({ userId: req.params.userId });
        res.status(200).json(customers);
    } catch (error) {
        next(error);
    }
}


export const getCustomer = async (req, res, next) => {
    try {
        const customer = await AddCustomerInfo.findOne({ userId: req.params.userId, customerId: req.params.customerId });
        res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
}


export const updateCustomer = async (req, res, next) => {
    const { customerName, customerEmail, customerPassword, customerPhone } = req.body;

    const customer = await AddCustomerInfo.findById(req.params._id);
    
    if (req.user.id === req.params._id || req.user.id === customer.userId) {
        if (!customer) {
            return next(errorHandler(404, 'User not found'));
        }

        if (req.body.customerPassword) {
            schema.is().min(8)
                    .is().max(100)
                    .has().uppercase()
                    .has().lowercase();

                    if (!schema.validate(customerPassword)) {
                        return next(errorHandler(400, 'Password must be at least 8 characters long and contain at least one uppercase letter and one lowercase letter'));
                    }
            req.body.customerPassword = bcrypt.hashSync(req.body.customerPassword, 10);
          }
          
         
          
          try {
            const updatedUser = await AddCustomerInfo.findByIdAndUpdate({
              _id: req.params._id,
            },
              {
                $set: {
                    customerName: customerName,
                    customerEmail: customerEmail,
                    customerPhone: customerPhone,
                    customerPassword: req.body.customerPassword,
                },
              },
              { new: true }
            );
            const { customerPassword, ...rest } = updatedUser._doc;
            res.status(200).json(rest);
          } catch (error) {
            next(error);
          }

    } else {
        return next(errorHandler(403, 'You are not allowed to update this user'));

    }
        
      
}


export const deleteCustomer = async (req, res, next) => {
    try {
        const customer = await AddCustomerInfo.findOneAndDelete({ userId: req.params.userId, customerId: req.params.customerId });
        res.status(200).json(customer);
    } catch (error) {
        next(error);
    }
}