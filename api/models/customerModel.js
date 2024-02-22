import mongoose from "mongoose";


const addCustomerInfoSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    customerId: {
        type: String,
        required: true,
        unique: true
    },
 
    customerName: { 
        type: String,
        required: true
    },
    customerEmail: { 
        type: String,
        required: true,
        unique: true
    },
    customerPassword: { 
        type: String,
        required: true
    },
    customerPhone: { type: String },

}, { timestamps: true })



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
    

}, { timestamps: true })


const Customer = mongoose.model('Customer', customerSchema);
const AddCustomerInfo = mongoose.model('addCustomerInfo', addCustomerInfoSchema)


export { Customer, AddCustomerInfo }