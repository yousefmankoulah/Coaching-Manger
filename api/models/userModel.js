import mongoose from 'mongoose';

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
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    customersLoginInfo: {
      type: Array,
      default: [
        {
          customerId: { type: String },
          customerName: { type: String },
          customerEmail: { type: String },
          customerPassword: { type: String },
          customerPhone: { type: String },
        },
      ],
    },

  customersWeeklyInfo: {
    type: Array,
    default: [
      {
        customerId: { type: String },
        customerWeeklyDiet: {type: Array, default: [{
                mealId: {type: String},
                mealName: {type: String},
                mealType: {type: String},
                mealCalories: {type: String},
                mealProtein: {type: String},
                mealCarbs: {type: String},
                mealFat: {type: String},
                date: {type: Date},
        }]},
        
        customerWeeklyExerciese: {type: Array, default: [{
            exerciseId: {type: String},
            exerciseName: {type: String},
            exercisePhoto: {type: String},
            date: {type: Date},
              
        }]
        }
    
  }]},


  },

  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;