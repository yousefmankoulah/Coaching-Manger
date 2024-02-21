import User from '../models/userModel.js';
import {AddCustomerInfo} from '../models/customerModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { errorHandler } from '../utils/error.js';



export const signup = async (req, res, next) => {
    const { fullName, email, password } = req.body;

    if (
        !fullName ||
        !email ||
        !password ||
        fullName === '' ||
        email === '' ||
        password === ''
      ) {
        next(errorHandler(400, 'All fields are required'));
      }


    const user = await User.findOne({ email });
    if (user) {
        next(errorHandler(400, 'User already exists'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
    });
    try{
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            newUser
        });
    } catch(err){
        next(error);
    }
   
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
          return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
          return next(errorHandler(400, 'Invalid password'));
        }
        const token = jwt.sign(
          { id: validUser._id, isAdmin: validUser.isAdmin },
          process.env.JWT_SECRET
        );
    
        const { password: pass, ...rest } = validUser._doc;
        
        res
          .status(200)
          .cookie('access_token', token, {
            httpOnly: true,
          })
          .json(rest);
      } catch (error) {
        next(error);
      }
}



export const customerSignin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
      next(errorHandler(400, 'All fields are required'));
  }

  try {
      const validUser = await AddCustomerInfo.findOne({ customerEmail: email });
      if (!validUser) {
        return next(errorHandler(404, 'User not found'));
      }
      const validPassword = bcrypt.compareSync(password, validUser.customerPassword);
      if (!validPassword) {
        return next(errorHandler(400, 'Invalid password'));
      }
      const token = jwt.sign(
        { id: validUser._id },
        process.env.JWT_SECRET
      );
  
      const { password: pass, ...rest } = validUser._doc;
      
      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
        })
        .json(rest);
    } catch (error) {
      next(error);
    }
}



export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};