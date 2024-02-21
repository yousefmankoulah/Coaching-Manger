import mongoose from "mongoose";


const customerSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true
    },

    customerCurrentWeight: {
        type: Number,
    },
    customerTargetWeight: {
        type: Number,
    },
    customerCurrentHeight: {
        type: Number,
    },
    customerCurrentAge: {
        type: Number,
    },

    customerCarringWeight:{
        type: Number,
        default: [{
            exerciseId: {type: String},
            exerciesBeginWeight: {type: String},
            exerciesEndWeight: {type: String},
            date: {type: Date},
    }],
    },
    

}, { timestamps: true })


const Customer = mongoose.model('Customer', customerSchema);

export default Customer