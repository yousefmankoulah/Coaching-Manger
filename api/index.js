import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import authRoute from './routes/authRoute.js'
import addCustomer from './routes/customerRoute.js'
import dietRoute from './routes/dietRoute.js'
import Diet from './models/dietModel.js'

dotenv.config()

//Connect with database

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDb is connected');
  })
  .catch((err) => {
    console.log(err);
  });


  //Delete Data after 45 days
  const deleteData = async () => {
    const diet = await Diet.find();
    for (let i = 0; i < diet.length; i++) {
      const date = new Date(diet[i].createdAt);
      if (date.getDate() === new Date().getDate() - 50) {
        await Diet.findByIdAndDelete(diet[i]._id);
      }
    }
  };
  

  //API
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//start server
app.listen(3000, () => {
    console.log(`Server running at 3000`)
    deleteData();
})


//Routes
app.use('/api/auth', authRoute)
app.use('/api/userCustomer', addCustomer)
app.use('/api/diet', dietRoute)


//ERROR HANDLING
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

